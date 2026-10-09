import type { ModelMessage } from "ai"
import * as Stream from "effect/Stream"
import type { LLMEvent } from "@opencode-ai/llm"
import type { Logger } from "@opencode-ai/core/util/log"
import type { Provider } from "@/provider/provider"
import { ProviderError } from "@/provider/error"
import { AccureSessionOverflow } from "./overflow"

const SAFETY = 2048
const MIN_OUTPUT = 1024
const SAFE_OUTPUT = 4096
const LEARNED = new Map<string, number>()

export namespace AccureLLM {
  // Stream failures and interruptions propagate while text deltas are collected.
  export function text(stream: Stream.Stream<LLMEvent, unknown>) {
    return stream.pipe(
      Stream.map((event) => (event.type === "text-delta" ? event.text : "")),
      Stream.mkString,
    )
  }

  export function timeout(input: {
    options: Record<string, unknown>
    fallback?: Record<string, unknown>
    log?: Pick<Logger, "debug">
  }): { timeout?: { chunkMs: number } } {
    const value =
      typeof input.options["chunkTimeout"] === "number"
        ? input.options["chunkTimeout"]
        : typeof input.fallback?.["chunkTimeout"] === "number"
          ? input.fallback["chunkTimeout"]
          : undefined
    if (!value) return {}
    input.log?.debug("chunk idle timeout configured", { chunkTimeout: value })
    return { timeout: { chunkMs: value } }
  }

  export function getContext(model: Provider.Model): number {
    const learned = LEARNED.get(model.id) ?? LEARNED.get(`${model.providerID}/${model.id}`)
    if (learned) return learned
    if (model.limit.context > 0) return model.limit.context
    const id = (model.id + " " + (model.api.id ?? "")).toLowerCase()
    if (id.includes("qwen") || model.providerID === "vllm") return 65_000
    return 0
  }

  export function needsEstimate(input: { model: Provider.Model; configured: number | undefined }) {
    return input.configured !== undefined && input.configured > 0 && getContext(input.model) > 0
  }

  export function canHealOverflow(input: { model: Provider.Model; message: string }) {
    const parsed = ProviderError.parseContextOverflow(input.message)
    if (!parsed?.context) return { healable: false }
    LEARNED.set(input.model.id, parsed.context)
    LEARNED.set(`${input.model.providerID}/${input.model.id}`, parsed.context)
    const context = parsed.context
    const inputTokens = parsed.input ?? 0
    const headroom = context - inputTokens - SAFETY
    if (headroom < MIN_OUTPUT) return { healable: false }
    return { healable: true, maxTokens: Math.min(SAFE_OUTPUT, headroom) }
  }

  /**
   * Caps `maxOutputTokens` to fit within the model's context window after
   * accounting for the actual estimated input tokens (messages + tool schemas).
   *
   * Many small models (e.g. qwen 7B, 32K context) ship with a default
   * max_output of 32K, leaving no room for input once tools are included.
   * This prevents the provider from rejecting the request with a context
   * overflow error.
   */
  export function capOutputTokens(input: {
    model: Provider.Model
    messages: ModelMessage[]
    tools: Record<string, { description?: string; inputSchema?: unknown }>
    configured: number | undefined
    tokens?: number
  }): number | undefined {
    if (input.configured == null) return input.configured
    if (input.configured <= 0) return undefined
    const context = getContext(input.model)
    const fallback = input.model.limit.output > 0 ? input.model.limit.output : SAFE_OUTPUT
    if (!context) return Math.min(input.configured, fallback)

    const ceiling =
      context <= 65_536
        ? Math.min(input.configured, Math.max(MIN_OUTPUT, Math.floor(context * 0.25)))
        : input.configured
    const tokens = input.tokens ?? AccureSessionOverflow.measure({ messages: input.messages, tools: input.tools }).raw
    const available = context - tokens - SAFETY
    if (available <= 0) return Math.min(ceiling, MIN_OUTPUT)
    if (available >= ceiling) return ceiling
    return Math.max(MIN_OUTPUT, available)
  }
}
