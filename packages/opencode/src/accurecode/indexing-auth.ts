import type { IndexingConfig } from "@accurecode/accure-indexing/config"

type Auth = unknown

type Env = {
  ACCURECODE_API_KEY?: string
  ACCURECODE_ORG_ID?: string
}

type Provider = {
  key?: unknown
  options?: Record<string, unknown>
}

export type AccureIndexingAuth = {
  apiKey?: string
  baseUrl?: string
  organizationId?: string
}

const providers = [
  "openai",
  "ollama",
  "openai-compatible",
  "gemini",
  "mistral",
  "vercel-ai-gateway",
  "bedrock",
  "openrouter",
  "voyage",
]

function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {}
  return value as Record<string, unknown>
}

function text(value: unknown): string | undefined {
  if (typeof value !== "string") return
  const trimmed = value.trim()
  return trimmed || undefined
}

function token(auth: Auth): string | undefined {
  const data = record(auth)
  if (data.type === "api") return text(data.key)
  if (data.type === "oauth") return text(data.access)
  return
}

function org(auth: Auth): string | undefined {
  const data = record(auth)
  if (data.type === "oauth") return text(data.accountId)
  return
}

function value(input: unknown): boolean {
  if (input === undefined || input === null) return false
  if (typeof input === "string") return input.trim().length > 0
  if (typeof input === "object") return Object.values(input).some(value)
  return true
}

function hasOtherProvider(indexing: unknown): boolean {
  const cfg = record(indexing)
  return providers.some((provider) => value(cfg[provider]))
}

export function resolveAccureIndexingAuth(input: {
  config?: unknown
  provider?: Provider
  auth?: Auth
  env?: Env
}): AccureIndexingAuth {
  const config = record(input.config)
  const options = record(record(config.provider).accurecode)
  const provider = input.provider ?? record(input.provider)
  const providerOptions = record(provider.options)
  const providerConfig = record(options.options)
  const accure = record(record(config.indexing).accurecode)
  const env = input.env ?? process.env

  return {
    apiKey:
      text(accure.apiKey) ??
      text(providerConfig.apiKey) ??
      token(input.auth) ??
      text(provider.key) ??
      text(providerOptions.accurecodeToken) ??
      text(env.ACCURECODE_API_KEY),
    baseUrl: text(accure.baseUrl) ?? text(providerConfig.baseURL) ?? text(providerConfig.baseUrl),
    organizationId:
      text(accure.organizationId) ??
      text(providerConfig.accurecodeOrganizationId) ??
      org(input.auth) ??
      text(providerOptions.accurecodeOrganizationId) ??
      text(env.ACCURECODE_ORG_ID),
  }
}

export function hasAccureIndexingAuth(input: Parameters<typeof resolveAccureIndexingAuth>[0]): boolean {
  return !!resolveAccureIndexingAuth(input).apiKey
}

export function shouldDefaultIndexingToAccure(indexing: unknown, auth: AccureIndexingAuth): boolean {
  const cfg = record(indexing)
  if (cfg.provider !== undefined || !auth.apiKey) return false
  return !hasOtherProvider(cfg)
}

export function indexingWithAccureDefault(
  indexing: IndexingConfig | undefined,
  auth: AccureIndexingAuth,
): IndexingConfig | undefined {
  if (!shouldDefaultIndexingToAccure(indexing, auth)) return indexing
  return { ...indexing, provider: "accure" }
}
