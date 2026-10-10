import { describe, expect, it } from "bun:test"
import { AccureLLM } from "../../src/accurecode/session/llm"
import { MessageV2 } from "../../src/session/message-v2"
import { ProviderTransform } from "../../src/provider/transform"
import type { Provider } from "../../src/provider/provider"
import { ProviderID, ModelID } from "../../src/provider/schema"

const errMsg =
  "This model's maximum context length is 65000 tokens. However, you requested 32000 output tokens and your prompt contains at least 33001 input tokens, for a total of at least 65001 tokens. Please reduce the length of the input prompt or the number of requested output tokens. (parameter=input_tokens, value=33001)"

const qwenModel = ({
  id: ModelID.make("qwen35"),
  providerID: ProviderID.make("vllm"),
  name: "ATM",
  api: { id: "qwen35", npm: "@ai-sdk/openai-compatible" },
  capabilities: { temperature: true },
  limit: { context: 0, output: 0 },
} as unknown as Provider.Model)

describe("Antigravity-style Self-Healing Context", () => {
  it("classifies all overflow error shapes as ContextOverflowError", () => {
    // Plain Error
    const plain = MessageV2.fromError(new Error(errMsg), { providerID: qwenModel.providerID })
    expect(MessageV2.ContextOverflowError.isInstance(plain)).toBe(true)

    // AI_APICallError
    const apiErr = new Error(errMsg)
    apiErr.name = "AI_APICallError"
    const parsedApi = MessageV2.fromError(apiErr, { providerID: qwenModel.providerID })
    expect(MessageV2.ContextOverflowError.isInstance(parsedApi)).toBe(true)

    // Object with error.message
    const objErr = MessageV2.fromError({ error: { message: errMsg } }, { providerID: qwenModel.providerID })
    expect(MessageV2.ContextOverflowError.isInstance(objErr)).toBe(true)
  })

  it("infers context for Qwen/vllm when context is 0", () => {
    expect(AccureLLM.getContext(qwenModel)).toBe(65_000)
  })

  it("safely defaults maxOutputTokens to 4096 when context is 0 on unknown models", () => {
    const unknownModel = ({
      id: ModelID.make("custom-unknown"),
      providerID: ProviderID.make("custom"),
      name: "Custom",
      api: { id: "custom", npm: "@ai-sdk/openai-compatible" },
      capabilities: {},
      limit: { context: 0, output: 0 },
    } as unknown as Provider.Model)
    expect(ProviderTransform.maxOutputTokens(unknownModel)).toBe(4_096)
  })

  it("scales maxOutputTokens down on 65k context models", () => {
    expect(ProviderTransform.maxOutputTokens(qwenModel)).toBe(16_250)
  })

  it("detects healable overflow and records learned context limit", () => {
    const heal = AccureLLM.canHealOverflow({ model: qwenModel, message: errMsg })
    expect(heal.healable).toBe(true)
    expect(heal.maxTokens).toBe(4_096)
    expect(AccureLLM.getContext(qwenModel)).toBe(65_000)
  })

  it("clamps output tokens to fit available headroom after learning context", () => {
    // 33001 tokens input on 65000 context with 2048 safety
    // available = 65000 - 33001 - 2048 = 29951
    // ceiling = Math.min(32000, Math.floor(65000 * 0.25)) = 16250
    // available (29951) >= ceiling (16250) -> returns 16250
    const clamped = AccureLLM.capOutputTokens({
      model: qwenModel,
      messages: [],
      tools: {},
      configured: 32_000,
      tokens: 33_001,
    })
    expect(clamped).toBe(16_250)
    expect(33_001 + (clamped ?? 0)).toBeLessThan(65_000)

    // With 55000 tokens input:
    // available = 65000 - 55000 - 2048 = 7952 < ceiling (16250)
    // returns 7952
    const clamped55k = AccureLLM.capOutputTokens({
      model: qwenModel,
      messages: [],
      tools: {},
      configured: 32_000,
      tokens: 55_000,
    })
    expect(clamped55k).toBe(7_952)
    expect(55_000 + (clamped55k ?? 0)).toBeLessThan(65_000)
  })
})
