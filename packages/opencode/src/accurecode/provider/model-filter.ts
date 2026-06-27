import type { Provider } from "@/provider/provider"
import { ProviderID } from "@/provider/schema"

export function filterPromptTrainingModels(providers: Record<string, Provider.Info>, hide: boolean) {
  if (!hide) return providers
  return Object.fromEntries(
    Object.entries(providers).map(([id, provider]) => {
      if (id !== ProviderID.accure) return [id, provider]
      const models = Object.fromEntries(
        Object.entries(provider.models).filter(([, model]) => model.mayTrainOnYourPrompts !== true),
      )
      return [id, { ...provider, models }]
    }),
  )
}

export function nonEmptyProviders(providers: Record<string, Provider.Info>) {
  return Object.fromEntries(Object.entries(providers).filter(([, provider]) => Object.keys(provider.models).length > 0))
}

/**
 * Remove Bedrock model IDs that definitively do not exist on AWS Bedrock.
 *
 * models.dev includes some fictional/fabricated entries. Everything else —
 * including NVIDIA Nemotron, OpenAI-OSS, Qwen, Writer, Gemma, etc. — may be
 * available via AWS Marketplace and is kept so users with marketplace access
 * can use them.
 *
 * The cross-region prefix bug (Nova models getting wrongly prefixed with us.)
 * is fixed separately in provider.ts getModel().
 */
export function filterBedrockModels(providers: Record<string, Provider.Info>) {
  const bedrock = providers["amazon-bedrock"]
  if (!bedrock) return providers

  // Only include modern models suitable for coding and reasoning.
  // Legacy models (Titan, AI21, Llama 2, early Cohere) are excluded.
  const allowedPatterns = [
    "anthropic.claude-3",
    "anthropic.claude-4",
    "anthropic.claude-opus",
    "anthropic.claude-sonnet",
    "anthropic.claude-haiku",
    "amazon.nova", // Nova Pro, Lite, Micro, Nova 2
    "meta.llama3",
    "meta.llama4",
    "mistral",
    "cohere.command-r",
    "deepseek",
    "nvidia.nemotron",
    "qwen",
    "google.gemma",
  ]

  const blockedPatterns = [
    "claude-fable", // fictional Anthropic codename — never existed
    "claude-instant",
  ]

  const filtered = Object.fromEntries(
    Object.entries(bedrock.models).filter(([id]) => {
      // Must not match any blocked pattern
      if (blockedPatterns.some((p) => id.includes(p))) return false
      // Must match at least one allowed pattern
      if (!allowedPatterns.some((p) => id.includes(p))) return false
      return true
    }),
  )

  return { ...providers, "amazon-bedrock": { ...bedrock, models: filtered } }
}
