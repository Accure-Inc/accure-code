import { Provider } from "@/provider/provider"
import { serviceUse } from "@/effect/service-use"
import * as Log from "@opencode-ai/core/util/log"
import { Context, Effect, Layer } from "effect"
import * as Stream from "effect/Stream"
import { streamText, wrapLanguageModel, type ModelMessage, type Tool } from "ai"
import type { LLMEvent } from "@opencode-ai/llm"
import { LLMClient, RequestExecutor, WebSocketExecutor } from "@opencode-ai/llm/route"
import type { LLMClientService } from "@opencode-ai/llm/route"
import { GitLabWorkflowLanguageModel } from "gitlab-ai-provider"
import { ProviderTransform } from "@/provider/transform"
import { Config } from "@/config/config"
import type { Agent } from "@/agent/agent"
import type { MessageV2 } from "./message-v2"
import { usable } from "./overflow" // accurecode_change
import { Plugin } from "@/plugin"
import { Permission } from "@/permission"
import { PermissionID } from "@/permission/schema"
import { Bus } from "@/bus"
import { Wildcard } from "@/util/wildcard"
import { SessionID } from "@/session/schema"
import { Auth } from "@/auth"
// accurecode_change start
import { ModelID } from "@/provider/schema"
import { InstanceState } from "@/effect/instance-state"
import { AccureSession } from "@/accurecode/session"
import { AccureLLM } from "@/accurecode/session/llm"
import { AccureSessionOverflow } from "@/accurecode/session/overflow"
import { SessionExport } from "@/accurecode/session-export"
import { getActiveOrg } from "@/accurecode/session-export/eligibility"
import { normalizeUsageForExport, observeFullStreamForExport } from "@/accurecode/session-export/llm"
// accurecode_change end
import { EffectBridge } from "@/effect/bridge"
import { RuntimeFlags } from "@/effect/runtime-flags"
import { LLMAISDK } from "./llm/ai-sdk"
import { LLMNativeRuntime } from "./llm/native-runtime"
import { LLMRequestPrep } from "./llm/request"

const log = Log.create({ service: "llm" })
export const OUTPUT_TOKEN_MAX = ProviderTransform.OUTPUT_TOKEN_MAX

export type StreamInput = {
  user: MessageV2.User
  sessionID: string
  parentSessionID?: string
  model: Provider.Model
  agent: Agent.Info
  permission?: Permission.Ruleset
  system: string[]
  messages: ModelMessage[]
  small?: boolean
  tools: Record<string, Tool>
  retries?: number
  toolChoice?: "auto" | "required" | "none"
  preflight?: boolean // accurecode_change - enable proactive threshold compaction for normal session turns
}

export type StreamRequest = StreamInput & {
  abort: AbortSignal
}

export interface Interface {
  readonly stream: (input: StreamInput) => Stream.Stream<LLMEvent, unknown>
}

export class Service extends Context.Service<Service, Interface>()("@opencode/LLM") {}

export const use = serviceUse(Service)

const live: Layer.Layer<
  Service,
  never,
  | Auth.Service
  | Config.Service
  | Provider.Service
  | Plugin.Service
  | Permission.Service
  | LLMClientService
  | RuntimeFlags.Service
> = Layer.effect(
  Service,
  Effect.gen(function* () {
    const auth = yield* Auth.Service
    const config = yield* Config.Service
    const provider = yield* Provider.Service
    const plugin = yield* Plugin.Service
    const perm = yield* Permission.Service
    const llmClient = yield* LLMClient.Service
    const flags = yield* RuntimeFlags.Service

    const run = Effect.fn("LLM.run")(function* (input: StreamRequest) {
      // accurecode_change start - apply custom/selected model overrides from provider options at request startup
      const providerInfo = yield* provider.getProvider(input.model.providerID)
      if (providerInfo) {
        const customModelID = providerInfo.options?.[`${input.model.id}-modelId`] ?? providerInfo.options?.selectedModelId
        if (customModelID && typeof customModelID === "string") {
          const resolved = yield* provider.getModel(input.model.providerID, ModelID.make(customModelID))
          if (resolved) {
            input.model = resolved
          }
        }
      }
      // accurecode_change end

      const l = log
        .clone()
        .tag("providerID", input.model.providerID)
        .tag("modelID", input.model.id)
        .tag("session.id", input.sessionID)
        .tag("small", (input.small ?? false).toString())
        .tag("agent", input.agent.name)
        .tag("mode", input.agent.mode)
      l.info("stream", {
        modelID: input.model.id,
        providerID: input.model.providerID,
      })

      const [language, cfg, item, info] = yield* Effect.all(
        [
          provider.getLanguage(input.model),
          config.get(),
          provider.getProvider(input.model.providerID),
          auth.get(input.model.providerID),
        ],
        { concurrency: "unbounded" },
      )
      const isWorkflow = language instanceof GitLabWorkflowLanguageModel
      const base = yield* LLMRequestPrep.prepare({
        ...input,
        provider: item,
        auth: info,
        plugin,
        flags,
        isWorkflow,
      })

      // accurecode_change start - compact at the configured threshold before contacting the provider
      const isOpenaiOauth = item.id === "openai" && info?.type === "oauth"
      const estimated: ModelMessage[] =
        isOpenaiOauth || isWorkflow
          ? [
              {
                role: "system",
                content: isOpenaiOauth ? String(base.params.options.instructions ?? "") : base.system.join("\n"),
              },
              ...base.messages,
            ]
          : base.messages
      const preflight = input.preflight === true && AccureSessionOverflow.enabled({ cfg, model: input.model })
      const cap = AccureLLM.needsEstimate({ model: input.model, configured: base.params.maxOutputTokens })
      const usage =
        cap || preflight ? AccureSessionOverflow.measure({ messages: estimated, tools: base.tools }) : undefined
      const maxOutputTokens = AccureLLM.capOutputTokens({
        model: input.model,
        messages: estimated,
        tools: base.tools,
        configured: base.params.maxOutputTokens,
        tokens: usage?.raw,
      })
      if (
        preflight &&
        usage &&
        AccureSessionOverflow.shouldCompact({
          cfg,
          model: input.model,
          usable: usable({ cfg, model: input.model, outputTokenMax: flags.outputTokenMax }), // accurecode_change
          tokens: usage.normalized,
          continuation: usage.continuation,
        })
      ) {
        return yield* Effect.fail(new AccureSessionOverflow.PreflightError())
      }
      const prepared = { ...base, params: { ...base.params, maxOutputTokens } }
      // accurecode_change end

      // Wire up toolExecutor for DWS workflow models so that tool calls
      // from the workflow service are executed via opencode's tool system
      // and results sent back over the WebSocket.
      if (language instanceof GitLabWorkflowLanguageModel) {
        const workflowModel = language as GitLabWorkflowLanguageModel & {
          sessionID?: string
          sessionPreapprovedTools?: string[]
          approvalHandler?: (approvalTools: { name: string; args: string }[]) => Promise<{ approved: boolean }>
        }
        workflowModel.sessionID = input.sessionID
        workflowModel.systemPrompt = prepared.system.join("\n")
        workflowModel.toolExecutor = async (toolName, argsJson, _requestID) => {
          const t = prepared.tools[toolName]
          if (!t || !t.execute) {
            return { result: "", error: `Unknown tool: ${toolName}` }
          }
          try {
            const result = await t.execute!(JSON.parse(argsJson), {
              toolCallId: _requestID,
              messages: input.messages,
              abortSignal: input.abort,
            })
            const output = typeof result === "string" ? result : (result?.output ?? JSON.stringify(result))
            return {
              result: output,
              metadata: typeof result === "object" ? result?.metadata : undefined,
              title: typeof result === "object" ? result?.title : undefined,
            }
          } catch (e: any) {
            return { result: "", error: e.message ?? String(e) }
          }
        }

        const ruleset = Permission.merge(input.agent.permission ?? [], input.permission ?? [])
        workflowModel.sessionPreapprovedTools = Object.keys(prepared.tools).filter((name) => {
          const match = ruleset.findLast((rule) => Wildcard.match(name, rule.permission))
          return !match || match.action !== "ask"
        })

        const bridge = yield* EffectBridge.make()
        const approvedToolsForSession = new Set<string>()
        workflowModel.approvalHandler = bridge.bind(async (approvalTools) => {
          const uniqueNames = [...new Set(approvalTools.map((t: { name: string }) => t.name))] as string[]
          // Auto-approve tools that were already approved in this session
          // (prevents infinite approval loops for server-side MCP tools)
          if (uniqueNames.every((name) => approvedToolsForSession.has(name))) {
            return { approved: true }
          }

          const id = PermissionID.ascending()
          let unsub: (() => void) | undefined
          try {
            unsub = Bus.subscribe(Permission.Event.Replied, (evt) => {
              if (evt.properties.requestID === id) void evt.properties.reply
            })
            const toolPatterns = approvalTools.map((t: { name: string; args: string }) => {
              try {
                const parsed = JSON.parse(t.args) as Record<string, unknown>
                const title = (parsed?.title ?? parsed?.name ?? "") as string
                return title ? `${t.name}: ${title}` : t.name
              } catch {
                return t.name
              }
            })
            const uniquePatterns = [...new Set(toolPatterns)] as string[]
            await bridge.promise(
              perm.ask({
                id,
                sessionID: SessionID.make(input.sessionID),
                permission: "workflow_tool_approval",
                patterns: uniquePatterns,
                metadata: { tools: approvalTools },
                always: uniquePatterns,
                ruleset: [],
              }),
            )
            for (const name of uniqueNames) approvedToolsForSession.add(name)
            workflowModel.sessionPreapprovedTools = [...(workflowModel.sessionPreapprovedTools ?? []), ...uniqueNames]
            return { approved: true }
          } catch {
            return { approved: false }
          } finally {
            unsub?.()
          }
        })
      }

      const instance = yield* InstanceState.context
      // accurecode_change start - capture eligible session export request start
      const isAccure = input.model.api.npm === "@accurecode/accure-gateway"
      const org = yield* isAccure && input.model.isFree === true
        ? Effect.promise(() => getActiveOrg())
        : Effect.succeed({ type: "unknown" as const })
      const started = Date.now()
      const parent = input.parentSessionID ?? AccureSession.resolveParent(input.sessionID)
      const found = AccureSession.resolveRoot(input.sessionID)
      const root = parent ? (found === input.sessionID ? parent : found) : input.sessionID
      const exportable =
        isAccure && input.model.isFree === true && org.type === "personal" && input.agent.name !== "title"
      if (exportable) {
        SessionExport.beforeRequest({
          input: { model: input.model, org },
          requestMeta: {
            sessionId: input.sessionID,
            rootSessionId: root,
            parentSessionId: parent,
            requestId: input.user.id,
            userMessageId: input.user.id,
            agent: input.agent.name,
            modeId: input.agent.mode,
            workspaceKey: instance.directory,
            agentInfo: SessionExport.agentInfo(input.agent),
          },
          assembled: {
            system: prepared.system,
            messages: prepared.messages,
            tools: prepared.tools,
            permissions: input.permission ?? [],
            toolChoice: input.toolChoice,
            params: prepared.params,
          },
        })
      }
      // accurecode_change end

      // Runtime seam: native is an opt-in adapter over @opencode-ai/llm. It
      // either returns a ready LLMEvent stream or a concrete fallback reason.
      if (flags.experimentalNativeLlm) {
        const native = LLMNativeRuntime.stream({
          model: input.model,
          provider: item,
          auth: info,
          llmClient,
          messages: prepared.messages,
          tools: prepared.tools,
          toolChoice: input.toolChoice,
          temperature: prepared.params.temperature,
          topP: prepared.params.topP,
          topK: prepared.params.topK,
          maxOutputTokens: prepared.params.maxOutputTokens,
          providerOptions: prepared.params.options,
          headers: prepared.headers,
          abort: input.abort,
        })
        if (native.type === "supported") {
          yield* Effect.logInfo("llm runtime selected").pipe(
            Effect.annotateLogs({
              "llm.runtime": "native",
              "llm.provider": input.model.providerID,
              "llm.model": input.model.id,
            }),
          )
          return {
            type: "native" as const,
            stream: native.stream,
          }
        }
        yield* Effect.logInfo("llm runtime selected").pipe(
          Effect.annotateLogs({
            "llm.runtime": "ai-sdk",
            "llm.provider": input.model.providerID,
            "llm.model": input.model.id,
            "llm.native_unsupported_reason": native.reason,
          }),
        )
        l.info("native runtime unavailable; falling back to ai-sdk", { reason: native.reason })
      }

      yield* Effect.logInfo("llm runtime selected").pipe(
        Effect.annotateLogs({
          "llm.runtime": "ai-sdk",
          "llm.provider": input.model.providerID,
          "llm.model": input.model.id,
        }),
      )
      // Default runtime path: AI SDK owns provider execution and tool dispatch;
      // LLMAISDK.toLLMEvents below normalizes fullStream parts for the processor.
      // accurecode_change start - debug dump for Bedrock empty response investigation
      if (input.model.api.npm === "@ai-sdk/amazon-bedrock") {
        try {
          const fsNode = require("fs")
          const dump = {
            ts: new Date().toISOString(),
            modelId: input.model.id,
            apiId: input.model.api.id,
            providerID: input.model.providerID,
            npm: input.model.api.npm,
            preflight: input.preflight,
            temperature: prepared.params.temperature,
            topP: prepared.params.topP,
            topK: prepared.params.topK,
            maxOutputTokens: prepared.params.maxOutputTokens,
            providerOptions: ProviderTransform.providerOptions(input.model, prepared.params.options),
            toolCount: Object.keys(prepared.tools).length,
            toolNames: Object.keys(prepared.tools).slice(0, 20),
            messageCount: prepared.messages.length,
            systemCount: prepared.messages.filter((m: any) => m.role === "system").length,
            messages: prepared.messages,
          }
          fsNode.writeFileSync(
            "/Users/ansarisam/accure/accure-code/packages/opencode/bedrock_debug.log",
            `[Bedrock Request Start]\n` + JSON.stringify(dump, null, 2) + "\n---\n",
            { flag: "a" },
          )
        } catch (err) {
          l.error("bedrock debug write error", { err })
        }
      }
      // accurecode_change end
      const result = streamText({
        // accurecode_change
        onError(error) {
          l.error("stream error", {
            error,
          })
          if (input.model.api.npm === "@ai-sdk/amazon-bedrock") {
            try {
              const fsNode = require("fs")
              const actualError = (error as any)?.error ?? error
              fsNode.writeFileSync(
                "/Users/ansarisam/accure/accure-code/packages/opencode/bedrock_debug.log",
                `STREAM ERROR: ${actualError?.message ?? actualError}\nStack: ${actualError?.stack}\n---\n`,
                { flag: "a" }
              )
            } catch {}
          }
        },
        async experimental_repairToolCall(failed) {
          const lower = failed.toolCall.toolName.toLowerCase()
          if (lower !== failed.toolCall.toolName && prepared.tools[lower]) {
            l.info("repairing tool call", {
              tool: failed.toolCall.toolName,
              repaired: lower,
            })
            return {
              ...failed.toolCall,
              toolName: lower,
            }
          }
          return {
            ...failed.toolCall,
            input: JSON.stringify({
              tool: failed.toolCall.toolName,
              error: failed.error.message,
            }),
            toolName: "invalid",
          }
        },
        temperature: prepared.params.temperature,
        topP: prepared.params.topP,
        topK: prepared.params.topK,
        providerOptions: ProviderTransform.providerOptions(input.model, prepared.params.options),
        activeTools: Object.keys(prepared.tools).filter((x) => x !== "invalid"),
        tools: prepared.tools,
        // accurecode_change start - Nova Pro requires explicit toolChoice when tools are present
        toolChoice:
          input.model.api.npm === "@ai-sdk/amazon-bedrock" &&
          input.toolChoice === undefined &&
          Object.keys(prepared.tools).length > 0
            ? "auto"
            : input.toolChoice,
        // accurecode_change end
        maxOutputTokens: prepared.params.maxOutputTokens,
        abortSignal: input.abort,
        ...AccureLLM.timeout({ options: prepared.params.options, fallback: item.options, log: l }), // accurecode_change
        headers: prepared.headers,
        maxRetries: input.retries ?? 0,
        messages: prepared.messages,
        model: wrapLanguageModel({
          model: language,
          middleware: [
            {
              specificationVersion: "v3" as const,
              async transformParams(args) {
                if (args.type === "stream") {
                  // @ts-expect-error
                  args.params.prompt = ProviderTransform.message(
                    args.params.prompt,
                    input.model,
                    prepared.messageTransformOptions,
                  )
                  // accurecode_change start - strip Bedrock-incompatible fields from tool inputSchemas.
                  // Effect's Schema.toJsonSchemaDocument adds $schema (Draft 2020-12 URI) and may
                  // produce $defs; Bedrock Converse API rejects both, returning a silent empty stream.
                  if (input.model.api.npm === "@ai-sdk/amazon-bedrock") {
                    const sanitize = (obj: unknown): void => {
                      if (Array.isArray(obj)) { obj.forEach(sanitize); return }
                      if (!obj || typeof obj !== "object") return
                      const rec = obj as Record<string, unknown>
                      delete rec.$schema
                      delete rec.$defs
                      delete rec.definitions
                      delete rec.additionalProperties
                      Object.values(rec).forEach(sanitize)
                    }
                    const tools = (args.params as any).tools
                    if (tools && typeof tools === "object") {
                      for (const t of Object.values(tools) as any[]) {
                        if (t?.inputSchema && typeof t.inputSchema === "object") {
                          sanitize(t.inputSchema)
                        }
                      }
                    }
                    // accurecode_change start - log the actual post-transform request sent to Bedrock
                    try {
                      const fsNode = require("fs")
                      const prompt = (args.params as any).prompt ?? []
                      const toolsAfter = (args.params as any).tools ?? []
                      const dump = {
                        ts: new Date().toISOString(),
                        label: "[POST-TRANSFORM actual messages sent to Bedrock]",
                        maxTokens: (args.params as any).maxTokens,
                        temperature: (args.params as any).temperature,
                        topP: (args.params as any).topP,
                        topK: (args.params as any).topK,
                        providerOptions: (args.params as any).providerOptions,
                        toolChoice: (args.params as any).toolChoice,
                        promptMessageCount: Array.isArray(prompt) ? prompt.length : "not-array",
                        systemLen: Array.isArray((args.params as any).system) ? (args.params as any).system.join("").length : 0,
                        prompt: Array.isArray(prompt) ? prompt.map((m: any) => ({
                          role: m.role,
                          content: Array.isArray(m.content)
                            ? m.content.map((p: any) => ({ type: p.type, text: p.text?.slice?.(0, 120) }))
                            : String(m.content).slice(0, 120),
                        })) : prompt,
                        toolCount: Array.isArray(toolsAfter) ? toolsAfter.length : Object.keys(toolsAfter).length,
                        tools: Array.isArray(toolsAfter)
                          ? toolsAfter.map((t: any) => ({ name: t.name, schemaKeys: Object.keys(t.inputSchema ?? {}) }))
                          : Object.entries(toolsAfter).map(([k, t]: any) => ({ name: k, schemaKeys: Object.keys(t.inputSchema ?? {}) })),
                        firstToolSchema: Array.isArray(toolsAfter) && toolsAfter[0]
                          ? toolsAfter[0].inputSchema
                          : undefined,
                      }
                      fsNode.writeFileSync(
                        "/Users/ansarisam/accure/accure-code/packages/opencode/bedrock_debug.log",
                        JSON.stringify(dump, null, 2) + "\n---\n",
                        { flag: "a" },
                      )
                    } catch {}
                    // accurecode_change end
                  }
                  // accurecode_change end
                }
                return args.params
              },
            },
          ],
        }),
        // accurecode_change start - disable AI SDK span recording (ai.* / gen_ai.*)
        experimental_telemetry: { isEnabled: false },
      })
      // accurecode_change end
      // accurecode_change start - capture eligible session export request completion off the stream path
      if (!exportable) return { type: "ai-sdk" as const, result }
      return {
        type: "ai-sdk" as const,
        result: {
          fullStream: observeFullStreamForExport(result.fullStream, {
            sessionId: input.sessionID,
            rootSessionId: root,
            parentSessionId: parent,
            requestId: input.user.id,
            workspaceKey: instance.directory,
            started,
            retries: input.retries ?? 0,
          }),
        },
      }
      // accurecode_change end
    })

    const stream: Interface["stream"] = (input) =>
      Stream.scoped(
        Stream.unwrap(
          Effect.gen(function* () {
            const ctrl = yield* Effect.acquireRelease(
              Effect.sync(() => new AbortController()),
              (ctrl) => Effect.sync(() => ctrl.abort()),
            )

            const result = yield* run({ ...input, abort: ctrl.signal })

            if (result.type === "native") return result.stream

            // Adapter seam: both runtimes expose the same LLMEvent stream. Native
            // already returns one; AI SDK streams are converted here.
            const state = LLMAISDK.adapterState()
            return Stream.fromAsyncIterable(result.result.fullStream, (e) =>
              e instanceof Error ? e : new Error(String(e)),
            ).pipe(
              Stream.mapEffect((event) => {
                if (input.model.api.npm === "@ai-sdk/amazon-bedrock") {
                  try {
                    const fsNode = require("fs")
                    fsNode.writeFileSync(
                      "/Users/ansarisam/accure/accure-code/packages/opencode/bedrock_debug.log",
                      `EVENT: ${JSON.stringify(event)}\n`,
                      { flag: "a" }
                    )
                  } catch (err) {
                    log.error("bedrock debug write event error", { err })
                  }
                }
                return LLMAISDK.toLLMEvents(state, event)
              }),
              Stream.flatMap((events) => Stream.fromIterable(events)),
            )
          }),
        ),
      )

    return Service.of({ stream })
  }),
)

export const layer = live.pipe(Layer.provide(Permission.defaultLayer))

export const defaultLayer = Layer.suspend(() =>
  layer.pipe(
    Layer.provide(Auth.defaultLayer),
    Layer.provide(Config.defaultLayer),
    Layer.provide(Provider.defaultLayer),
    Layer.provide(Plugin.defaultLayer),
    Layer.provide(
      LLMClient.layer.pipe(Layer.provide(Layer.mergeAll(RequestExecutor.defaultLayer, WebSocketExecutor.layer))),
    ),
    Layer.provide(RuntimeFlags.defaultLayer),
  ),
)

// accurecode_change start - session export stream observer
export { normalizeUsageForExport, observeFullStreamForExport }
// accurecode_change end
export const hasToolCalls = LLMRequestPrep.hasToolCalls

export * as LLM from "./llm"
