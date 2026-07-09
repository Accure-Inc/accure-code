import { afterEach, describe, expect } from "bun:test"
import path from "path"
import fs from "fs"
import { Effect, Layer } from "effect"
import { CrossSpawnSpawner } from "@opencode-ai/core/cross-spawn-spawner"
import { ToolRegistry } from "@/tool/registry"
import { disposeAllInstances } from "../fixture/fixture"
import { testEffect } from "../lib/effect"
import { TestConfig } from "../fixture/config"
import { AppFileSystem } from "@opencode-ai/core/filesystem"
import { Plugin } from "@/plugin"
import { Question } from "@/question"
import { Todo } from "@/session/todo"
import { Skill } from "@/skill"
import { Agent } from "@/agent/agent"
import { BackgroundJob } from "@/background/job"
import { Session } from "@/session/session"
import { SessionStatus } from "@/session/status"
import { Provider } from "@/provider/provider"
import { Git } from "@/git"
import { LSP } from "@/lsp/lsp"
import { Instruction } from "@/session/instruction"
import { Bus } from "@/bus"
import { FetchHttpClient } from "effect/unstable/http"
import { Format } from "@/format"
import { Ripgrep } from "@/file/ripgrep"
import * as Truncate from "@/tool/truncate"
import { InstanceState } from "@/effect/instance-state"
import { Reference } from "@/reference/reference"
import { RepositoryCache } from "@/reference/repository-cache"
import { ProviderID, ModelID } from "@/provider/schema"
import { ToolJsonSchema } from "@/tool/json-schema"
import { RuntimeFlags } from "@/effect/runtime-flags"
import { Command } from "@/command"
import { ProviderTransform } from "@/provider/transform"
import { streamText, tool, jsonSchema, wrapLanguageModel } from "ai"
import { createAmazonBedrock } from "@ai-sdk/amazon-bedrock"

const node = CrossSpawnSpawner.defaultLayer
const configLayer = TestConfig.layer({
  directories: () => InstanceState.directory.pipe(Effect.map((dir) => [path.join(dir, ".opencode")])),
})

const registryLayer = () =>
  ToolRegistry.layer
    .pipe(
      Layer.provide(configLayer),
      Layer.provide(Plugin.defaultLayer),
      Layer.provide(Question.defaultLayer),
      Layer.provide(Todo.defaultLayer),
      Layer.provide(Skill.defaultLayer),
      Layer.provide(Agent.defaultLayer),
      Layer.provide(Session.defaultLayer),
      Layer.provide(Layer.mergeAll(SessionStatus.defaultLayer, BackgroundJob.defaultLayer)),
      Layer.provide(Provider.defaultLayer),
      Layer.provide(Layer.mergeAll(Git.defaultLayer, RepositoryCache.defaultLayer)),
      Layer.provide(Reference.defaultLayer),
      Layer.provide(LSP.defaultLayer),
      Layer.provide(Instruction.defaultLayer),
      Layer.provide(AppFileSystem.defaultLayer),
      Layer.provide(Bus.layer),
      Layer.provide(FetchHttpClient.layer),
      Layer.provide(Format.defaultLayer),
      Layer.provide(node),
      Layer.provide(Ripgrep.defaultLayer),
      Layer.provide(Truncate.defaultLayer),
    )
    .pipe(
      Layer.provide(RuntimeFlags.layer({})),
      Layer.provide(Command.defaultLayer),
    )

const it = testEffect(Layer.mergeAll(registryLayer(), node, Agent.defaultLayer))

afterEach(async () => {
  await disposeAllInstances()
})

const bedrockModel: any = {
  id: "amazon.nova-pro-v1:0",
  providerID: "amazon-bedrock",
  api: {
    id: "amazon.nova-pro-v1:0",
    npm: "@ai-sdk/amazon-bedrock"
  },
  limit: {
    output: 8192
  },
  capabilities: {
    interleaved: false
  }
}

describe("bedrock schemas test", () => {
  it.instance("checks all tool schemas for amazon-bedrock", () =>
    Effect.gen(function* () {
      const registry = yield* ToolRegistry.Service
      const tools = yield* registry.tools({
        modelID: ModelID.make(bedrockModel.api.id),
        providerID: bedrockModel.providerID,
        agent: { name: "developer", mode: "code", permission: [] } as any,
      })

      console.log(`Checking schemas for ${tools.length} tools:`)
      for (const item of tools) {
        const rawSchema = ToolJsonSchema.fromTool(item)
        const sanitized = ProviderTransform.schema(bedrockModel, rawSchema)
        console.log(`Tool: ${item.id}`)
        expect(sanitized.type).toBe("object")
        expect(sanitized.$schema).toBeUndefined()
        expect(sanitized.additionalProperties).toBeUndefined()
      }
    }),
  )

  it.instance("runs live query with tools and debug messages", () =>
    Effect.gen(function* () {
      const registry = yield* ToolRegistry.Service
      const toolsList = yield* registry.tools({
        modelID: ModelID.make(bedrockModel.api.id),
        providerID: bedrockModel.providerID,
        agent: { name: "developer", mode: "code", permission: [] } as any,
      })

      const tools: Record<string, any> = {}
      for (const item of toolsList) {
        const schema = ProviderTransform.schema(bedrockModel, ToolJsonSchema.fromTool(item))
        tools[item.id] = tool({
          description: item.description,
          inputSchema: jsonSchema(schema),
          execute: async (args) => "mock result"
        })
      }

      // Read debug log
      const logContent = fs.readFileSync("/Users/ansarisam/accure/accure-code/packages/opencode/bedrock_debug.log", "utf8")
      const blocks = logContent.split("\n---\n")
      const data = blocks
        .slice()
        .reverse()
        .map((b) => b.trim())
        .filter((b) => b.startsWith("{"))
        .map((b) => {
          try {
            return JSON.parse(b)
          } catch (e) {
            return null
          }
        })
        .find((d) => d !== null)

      if (!data) {
        console.log("No debug block found, skipping live query test.")
        return
      }

      console.log("Running LIVE request with tools to Bedrock...")
      
      const bedrock = createAmazonBedrock({ 
        region: "us-east-1",
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "mock-key",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "mock-secret"
      })

      yield* Effect.promise(async () => {
        try {
          const result = await streamText({
            model: wrapLanguageModel({
              model: bedrock(bedrockModel.id),
              middleware: [
                {
                  specificationVersion: "v3" as const,
                  async transformParams(args) {
                    if (args.type === "stream") {
                      // @ts-expect-error
                      args.params.prompt = ProviderTransform.message(
                        args.params.prompt,
                        bedrockModel,
                        data.providerOptions || {},
                      )
                    }
                    return args.params
                  },
                },
              ],
            }),
            messages: data.messages,
            tools,
            temperature: 0.5,
          })

          let textLength = 0
          for await (const chunk of result.textStream) {
            textLength += chunk.length
            process.stdout.write(chunk)
          }
          const finish = await result.finishReason;
          const toolCalls = await result.toolCalls
          console.log(`\nLive Query Done. Finish Reason: ${finish}, Tool Calls:`, JSON.stringify(toolCalls, null, 2))
        } catch (err: any) {
          console.error("LIVE Query Failed:", err.name, "-", err.message)
          if (err.cause) {
            console.error("Cause:", err.cause)
          }
        }
      })
    }),
  )
})
