import { createAmazonBedrock } from "@ai-sdk/amazon-bedrock"
import {
  type LanguageModelV3,
  type LanguageModelV3CallOptions,
  type LanguageModelV3StreamPart,
  type LanguageModelV3GenerateResult,
} from "@ai-sdk/provider"

export class CustomBedrockLanguageModel implements LanguageModelV3 {
  readonly specificationVersion = "v3"

  constructor(
    private readonly underlyingModel: LanguageModelV3,
    readonly modelId: string
  ) {}

  get provider(): string {
    return "amazon-bedrock-custom"
  }

  get supportedUrls() {
    return this.underlyingModel.supportedUrls
  }

  async doGenerate(
    options: LanguageModelV3CallOptions,
  ): Promise<LanguageModelV3GenerateResult> {
    const cleanOptions = sanitizeOptions(options, this.modelId)
    return this.underlyingModel.doGenerate(cleanOptions)
  }

  async doStream(
    options: LanguageModelV3CallOptions,
  ): Promise<{
    stream: ReadableStream<LanguageModelV3StreamPart>
  }> {
    const cleanOptions = sanitizeOptions(options, this.modelId)
    return this.underlyingModel.doStream(cleanOptions)
  }
}

function sanitizeOptions(options: LanguageModelV3CallOptions, modelId: string): LanguageModelV3CallOptions {
  const sanitizedPrompt: any[] = []

  for (const msg of options.prompt) {
    const role = msg.role
    let content = msg.content

    if (Array.isArray(content)) {
      content = content.map((part) => {
        const p = part as any
        if (p.type === "text") {
          const cleanPart: any = { type: "text", text: p.text || "Hello" }
          return cleanPart
        }
        if (p.type === "image" || p.type === "file") {
          const cleanPart = { ...p }
          delete cleanPart.providerOptions
          return cleanPart
        }
        return p
      }).filter((part) => {
        const p = part as any
        if (p.type === "text" && !p.text?.trim()) {
          return false
        }
        return true
      })
    }

    const cleanMsg: any = {
      role,
      content,
    }

    const last = sanitizedPrompt[sanitizedPrompt.length - 1]
    if (last && last.role === role) {
      if (Array.isArray(last.content) && Array.isArray(cleanMsg.content)) {
        last.content = [...last.content, ...cleanMsg.content]
      } else {
        const lastStr = typeof last.content === "string" ? last.content : JSON.stringify(last.content)
        const cleanStr = typeof cleanMsg.content === "string" ? cleanMsg.content : JSON.stringify(cleanMsg.content)
        last.content = lastStr + "\n" + cleanStr
      }
    } else {
      sanitizedPrompt.push(cleanMsg)
    }
  }

  if (sanitizedPrompt.length > 0 && sanitizedPrompt[0].role === "assistant") {
    sanitizedPrompt.unshift({ role: "user", content: "Hello" })
  }

  const sanitizeSchema = (obj: any): any => {
    if (Array.isArray(obj)) {
      return obj.map(sanitizeSchema)
    } else if (obj && typeof obj === "object") {
      const copy = { ...obj }
      delete copy.$schema
      delete copy.additionalProperties
      for (const [k, v] of Object.entries(copy)) {
        copy[k] = sanitizeSchema(v)
      }
      return copy
    }
    return obj
  }

  const sanitizedTools = options.tools?.map((tool) => {
    if (tool.type === "function") {
      return {
        ...tool,
        inputSchema: sanitizeSchema(tool.inputSchema),
      }
    }
    return tool
  })

  let maxOutputTokens = options.maxOutputTokens
  const id = modelId.toLowerCase()
  let limit = 4096
  if (id.includes("nova")) {
    limit = 5000
  } else if (id.includes("claude-3-5") || id.includes("claude-3.5")) {
    limit = 8192
  }
  if (!maxOutputTokens || maxOutputTokens > limit) {
    maxOutputTokens = limit
  }

  return {
    ...options,
    prompt: sanitizedPrompt,
    tools: sanitizedTools,
    maxOutputTokens,
  }
}

export function createCustomBedrockSDK(options: any) {
  const sdk = createAmazonBedrock(options)

  return {
    languageModel(modelId: string) {
      const model = sdk.languageModel(modelId)
      return new CustomBedrockLanguageModel(model, modelId)
    },
  }
}
