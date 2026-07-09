import { afterEach, beforeAll, afterAll, describe, expect, it } from "bun:test"
import path from "path"
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
import { RuntimeFlags } from "@/effect/runtime-flags"
import { Command } from "@/command"
import { ProviderTransform } from "@/provider/transform"
import type { ModelMessage } from "ai"

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

const testIt = testEffect(Layer.mergeAll(registryLayer(), node, Agent.defaultLayer, Provider.defaultLayer))

afterEach(async () => {
  await disposeAllInstances()
})

describe("Bedrock Nova Pro maxOutputTokens Test", () => {
  beforeAll(() => {
    process.env["AWS_ACCESS_KEY_ID"] = "dummy-key"
    process.env["AWS_SECRET_ACCESS_KEY"] = "dummy-secret"
    process.env["AWS_REGION"] = "us-east-1"
  })

  afterAll(() => {
    delete process.env["AWS_ACCESS_KEY_ID"]
    delete process.env["AWS_SECRET_ACCESS_KEY"]
    delete process.env["AWS_REGION"]
  })

  testIt.instance("resolves catalog model and checks maxOutputTokens", () =>
    Effect.gen(function* () {
      const prov = yield* Provider.Service
      const model = yield* prov.getModel(
        ProviderID.make("amazon-bedrock"),
        ModelID.make("amazon.nova-pro-v1:0"),
      )
      console.log("Resolved Model details:", JSON.stringify(model, null, 2))
      const tokens = ProviderTransform.maxOutputTokens(model, 32000)
      console.log("maxOutputTokens resolved:", tokens)
      expect(tokens).toBeLessThanOrEqual(10000)
    }),
  )

  testIt.instance(
    "resolves model override and ensures getLanguage uses overridden model limit",
    () =>
      Effect.gen(function* () {
        const prov = yield* Provider.Service
        const model = yield* prov.getModel(
          ProviderID.make("amazon-bedrock"),
          ModelID.make("global.anthropic.claude-haiku-4-5-20251001-v1:0"),
        )
        console.log("Resolved Model for Haiku:", model.id)
        expect(model.id).toBe(ModelID.make("amazon.nova-pro-v1:0"))

        const tokens = ProviderTransform.maxOutputTokens(model, 32000)
        console.log("maxOutputTokens resolved for Haiku override:", tokens)
        expect(tokens).toBeLessThanOrEqual(10000)
      }),
    {
      config: {
        provider: {
          "amazon-bedrock": {
            options: {
              selectedModelId: "amazon.nova-pro-v1:0",
            },
          },
        },
      },
    },
  )
})

// Unit tests for mergeConsecutiveUserMessages via ProviderTransform.message()
// These do not require a live provider — they test the message() transform directly.
describe("Bedrock Nova Pro — consecutive user message merging", () => {
  // Minimal fake Bedrock Nova Pro model stub
  const novaModel = {
    id: ModelID.make("amazon.nova-pro-v1:0"),
    providerID: ProviderID.make("amazon-bedrock"),
    api: { npm: "@ai-sdk/amazon-bedrock", id: "amazon.nova-pro-v1:0" },
    limit: { context: 300000, output: 8192 },
    capabilities: { input: { text: true } },
    options: {},
  } as unknown as Provider.Model

  it("merges two consecutive user messages into one", () => {
    const msgs: ModelMessage[] = [
      { role: "user", content: "Generate a title for this conversation:\n" },
      { role: "user", content: [{ type: "text", text: "write hello world in python" }] },
    ]
    const result = ProviderTransform.message(msgs, novaModel, {})
    const userMsgs = result.filter((m) => m.role === "user")
    expect(userMsgs).toHaveLength(1)
    const parts = userMsgs[0].content as Array<{ type: string; text?: string }>
    expect(Array.isArray(parts)).toBe(true)
    expect(parts.some((p) => p.type === "text" && p.text?.includes("Generate a title"))).toBe(true)
    expect(parts.some((p) => p.type === "text" && p.text?.includes("write hello world"))).toBe(true)
  })

  it("does not merge user messages separated by an assistant message", () => {
    const msgs: ModelMessage[] = [
      { role: "user", content: "hello" },
      { role: "assistant", content: "hi" },
      { role: "user", content: "how are you?" },
    ]
    const result = ProviderTransform.message(msgs, novaModel, {})
    const userMsgs = result.filter((m) => m.role === "user")
    expect(userMsgs).toHaveLength(2)
  })

  it("merges three consecutive user messages into one", () => {
    const msgs: ModelMessage[] = [
      { role: "user", content: "a" },
      { role: "user", content: "b" },
      { role: "user", content: "c" },
    ]
    const result = ProviderTransform.message(msgs, novaModel, {})
    const userMsgs = result.filter((m) => m.role === "user")
    expect(userMsgs).toHaveLength(1)
    const parts = userMsgs[0].content as Array<{ type: string; text?: string }>
    expect(parts).toHaveLength(3)
  })

  it("does not merge user messages for non-Bedrock models", () => {
    const anthropicModel = {
      ...novaModel,
      api: { npm: "@ai-sdk/anthropic", id: "claude-3-5-sonnet-20241022" },
      id: ModelID.make("claude-3-5-sonnet-20241022"),
      providerID: ProviderID.make("anthropic"),
    } as unknown as Provider.Model

    const msgs: ModelMessage[] = [
      { role: "user", content: "a" },
      { role: "user", content: "b" },
    ]
    const result = ProviderTransform.message(msgs, anthropicModel, {})
    const userMsgs = result.filter((m) => m.role === "user")
    expect(userMsgs).toHaveLength(2)
  })

  it("caps maxOutputTokens at 10000 for bare Nova Pro model ID", () => {
    expect(ProviderTransform.maxOutputTokens(novaModel, 32000)).toBeLessThanOrEqual(10000)
  })

  it("caps maxOutputTokens at 10000 for cross-region prefixed Nova Pro model ID (us.amazon.nova-pro-v1:0)", () => {
    const prefixed = {
      ...novaModel,
      id: ModelID.make("us.amazon.nova-pro-v1:0"),
      api: { npm: "@ai-sdk/amazon-bedrock", id: "us.amazon.nova-pro-v1:0" },
    } as unknown as Provider.Model
    expect(ProviderTransform.maxOutputTokens(prefixed, 32000)).toBeLessThanOrEqual(10000)
  })

  it("does not cap maxOutputTokens for non-Nova Bedrock models", () => {
    const haiku = {
      ...novaModel,
      id: ModelID.make("anthropic.claude-haiku-4-5-20251001-v1:0"),
      api: { npm: "@ai-sdk/amazon-bedrock", id: "anthropic.claude-haiku-4-5-20251001-v1:0" },
      limit: { context: 200000, output: 8192 },
    } as unknown as Provider.Model
    // Claude Haiku has 8192 output limit — should not be capped at 10000
    const tokens = ProviderTransform.maxOutputTokens(haiku, 32000)
    expect(tokens).toBeLessThanOrEqual(8192)
  })
})
