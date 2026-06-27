// accurecode_change - new file
import { Config } from "@/config/config"
import { Auth } from "@/auth"
import { ModelCache } from "./model-cache"
import * as Core from "@opencode-ai/core/models-dev"
import { Context, Effect, Layer } from "effect"
import { AI_SDK_PROVIDERS, ACCURECODE_OPENROUTER_BASE, PROMPTS } from "@accurecode/accure-gateway"

export const Model = Core.Model
export type Model = Core.Model
export const Provider = Core.Provider
export type Provider = Core.Provider
export const CatalogModelStatus = Core.CatalogModelStatus
export type CatalogModelStatus = Core.CatalogModelStatus

export interface Interface extends Core.Interface {}

export class Service extends Context.Service<Service, Interface>()("@opencode/ModelsDev") {}

function baseURL(url: string | undefined, org: string | undefined) {
  if (!url) return
  const base = url.replace(/\/+$/, "")
  if (org) {
    if (base.includes("/api/organizations/")) return base
    if (base.endsWith("/api")) return `${base}/organizations/${org}`
    return `${base}/api/organizations/${org}`
  }
  if (base.includes("/openrouter")) return base
  if (base.endsWith("/api")) return `${base}/openrouter`
  return `${base}/api/openrouter`
}

export const layer: Layer.Layer<Service, never, Core.Service | Config.Service | Auth.Service | ModelCache.Service> =
  Layer.effect(
    Service,
    Effect.gen(function* () {
      const core = yield* Core.Service
      const config = yield* Config.Service
      const auth = yield* Auth.Service
      const cache = yield* ModelCache.Service

      const get = Effect.fn("ModelsDev.get")(function* () {
        const providers = { ...(yield* core.get()) }
        delete providers.kilo

        const cfg = yield* config.get()
        const disabled = new Set(cfg.disabled_providers ?? [])
        const enabled = cfg.enabled_providers ? new Set(cfg.enabled_providers) : undefined
        const allowed = (!enabled || enabled.has("accure")) && !disabled.has("accure")
        const apt = cfg.provider?.apertis?.options
        const aptURL = apt?.baseURL ?? "https://api.apertis.ai/v1"
        const aptOpts = apt?.baseURL ? { baseURL: apt.baseURL } : {}

        const addApertis = Effect.fnUntraced(function* () {
          if (providers.apertis) return
          const models = yield* cache.fetch("apertis", aptOpts).pipe(Effect.catch(() => Effect.succeed({})))
          providers.apertis = {
            id: "apertis",
            name: "Apertis",
            env: ["APERTIS_API_KEY"],
            api: aptURL,
            npm: "@ai-sdk/openai-compatible",
            models,
          }
          if (Object.keys(models).length === 0)
            yield* cache.refresh("apertis", aptOpts).pipe(Effect.ignore, Effect.forkDetach)
        })

        const accureIqxUrl = process.env.VLLM_BASE_URL || process.env.ACCUREIQX_API_URL || "http://localhost:8000/v1"
        const accureIqxUrlNormalized = accureIqxUrl.endsWith("/") ? accureIqxUrl : `${accureIqxUrl}/`
        providers.accureiqx = {
          id: "accureiqx",
          name: "AccureIQx",
          env: ["ACCUREIQX_API_KEY"],
          api: accureIqxUrlNormalized,
          npm: "@ai-sdk/openai-compatible",
          models: {
            "accureiqx-default": {
              id: "accureiqx-default",
              name: "AccureIQx Default",
              family: "openai",
              cost: { input: 0, output: 0 },
              limit: { context: 16384, output: 4096 },
              attachment: true,
              reasoning: false,
              temperature: true,
              tool_call: true,
              release_date: "",
              modalities: { input: ["text", "image"], output: ["text"] },
            },
          },
        }

        // Accure Models: vLLM-based provider with ATM-3, ATM-4, AVM-3
        // Always injected so models appear in the picker; the dialog collects credentials.
        const accureModelsCfg = cfg.provider?.["accure-models"]?.options
        const accureBaseUrl = process.env.ACCURE_MODELS_URL || accureModelsCfg?.baseURL || "http://jenkins.accure.ai:9006/v1"
        providers["accure-models"] = {
          id: "accure-models",
          name: "Accure Models",
          env: ["ACCURE_MODELS_API_KEY"],
          npm: "@ai-sdk/openai-compatible",
          api: accureBaseUrl.endsWith("/") ? accureBaseUrl : `${accureBaseUrl}/`,
          models: {
            "atm-3": {
              id: "atm-3",
              name: "Accure ATM-3",
              family: "openai",
              cost: { input: 0, output: 0 },
              limit: { context: 128000, output: 8192 },
              attachment: false,
              reasoning: false,
              temperature: true,
              tool_call: true,
              release_date: "",
              modalities: { input: ["text"], output: ["text"] },
            },
            "atm-4": {
              id: "atm-4",
              name: "Accure ATM-4",
              family: "openai",
              cost: { input: 0, output: 0 },
              limit: { context: 128000, output: 8192 },
              attachment: true,
              reasoning: false,
              temperature: true,
              tool_call: true,
              release_date: "",
              modalities: { input: ["text", "image"], output: ["text"] },
            },
            "avm-3": {
              id: "avm-3",
              name: "Accure AVM-3",
              family: "openai",
              cost: { input: 0, output: 0 },
              limit: { context: 128000, output: 8192 },
              attachment: true,
              reasoning: false,
              temperature: true,
              tool_call: true,
              release_date: "",
              modalities: { input: ["text", "image"], output: ["text"] },
            },
          },
        }

        if (!allowed) {
          yield* addApertis()
          return providers
        }

        const opts = cfg.provider?.accurecode?.options
        const info = yield* auth.get("accure").pipe(Effect.catch(() => Effect.succeed(undefined)))
        const org = opts?.accurecodeOrganizationId ?? (info?.type === "oauth" ? info.accountId : undefined)
        const url = baseURL(opts?.baseURL, org)
        const fetch = {
          ...(url ? { baseURL: url } : {}),
          ...(org ? { accurecodeOrganizationId: org } : {}),
        }
        const models = yield* cache.fetch("accure", fetch).pipe(Effect.catch(() => Effect.succeed({})))
        providers.accure = {
          id: "accure",
          name: "Accure Gateway",
          env: ["ACCURECODE_API_KEY"],
          api: ACCURECODE_OPENROUTER_BASE.endsWith("/") ? ACCURECODE_OPENROUTER_BASE : `${ACCURECODE_OPENROUTER_BASE}/`,
          npm: "@accurecode/accure-gateway",
          models,
        }
        if (Object.keys(models).length === 0)
          yield* cache.refresh("accure", fetch).pipe(Effect.ignore, Effect.forkDetach)

        yield* addApertis()
        return providers
      })

      return Service.of({ get, refresh: core.refresh })
    }),
  )

export const defaultLayer = layer.pipe(
  Layer.provide(Core.defaultLayer),
  Layer.provide(Config.defaultLayer),
  Layer.provide(Auth.defaultLayer),
  Layer.provide(ModelCache.defaultLayer),
)

export { AI_SDK_PROVIDERS, PROMPTS }
export * as ModelsDev from "./models"
