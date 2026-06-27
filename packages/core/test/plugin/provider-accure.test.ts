import { describe, expect } from "bun:test"
import { Effect } from "effect"
import { Catalog } from "@opencode-ai/core/catalog"
import { PluginV2 } from "@opencode-ai/core/plugin"
import { ProviderPlugins } from "@opencode-ai/core/plugin/provider"
import { AccurePlugin } from "@opencode-ai/core/plugin/provider/accure"
import { ProviderV2 } from "@opencode-ai/core/provider"
import { expectPluginRegistered, it, model, provider, withEnv } from "./provider-helper" // accurecode_change

describe("AccurePlugin", () => {
  it.effect("is registered so legacy referer headers can be applied", () =>
    Effect.sync(() =>
      expectPluginRegistered(
        ProviderPlugins.map((item) => item.id),
        "accure",
      ),
    ),
  )

  it.effect("applies legacy referer headers only to accure", () =>
    Effect.gen(function* () {
      const plugin = yield* PluginV2.Service
      const catalog = yield* Catalog.Service
      yield* plugin.add(AccurePlugin)
      const load = yield* catalog.loader()
      yield* load((catalog) => {
        const accure = provider("accure", {
          endpoint: {
            type: "aisdk",
            package: "@ai-sdk/openai-compatible",
            url: "https://api.accurecode.ai/api/gateway",
          },
          options: { headers: { Existing: "value" }, body: {}, aisdk: { provider: {}, request: {} } },
        })
        catalog.provider.update(accure.id, (draft) => {
          draft.endpoint = accure.endpoint
          draft.options = accure.options
        })
        catalog.provider.update(provider("openrouter").id, () => {})
      })
      expect((yield* catalog.provider.get(ProviderV2.ID.make("accure"))).options.headers).toEqual({
        Existing: "value",
        "HTTP-Referer": "https://accure.ai/",
        "X-Title": "Accure Code", // accurecode_change
      })
      expect((yield* catalog.provider.get(ProviderV2.ID.openrouter)).options.headers).toEqual({})
    }),
  )

  it.effect("uses the exact legacy Accure header casing and set", () =>
    Effect.gen(function* () {
      const plugin = yield* PluginV2.Service
      const catalog = yield* Catalog.Service
      yield* plugin.add(AccurePlugin)
      const load = yield* catalog.loader()
      yield* load((catalog) => {
        const item = provider("accure", {
          endpoint: {
            type: "aisdk",
            package: "@ai-sdk/openai-compatible",
            url: "https://api.accurecode.ai/api/gateway",
          },
        })
        catalog.provider.update(item.id, (draft) => {
          draft.endpoint = item.endpoint
        })
      })

      const result = yield* catalog.provider.get(ProviderV2.ID.make("accure"))
      expect(result.options.headers).toEqual({
        "HTTP-Referer": "https://accure.ai/",
        "X-Title": "Accure Code", // accurecode_change
      })
      expect(result.options.headers).not.toHaveProperty("http-referer")
      expect(result.options.headers).not.toHaveProperty("x-title")
      expect(result.options.headers).not.toHaveProperty("X-Source")
    }),
  )

  it.effect("uses the legacy provider-id guard instead of endpoint package matching", () =>
    Effect.gen(function* () {
      const plugin = yield* PluginV2.Service
      const catalog = yield* Catalog.Service
      yield* plugin.add(AccurePlugin)
      const load = yield* catalog.loader()
      yield* load((catalog) => {
        const accure = provider("accure", {
          endpoint: {
            type: "aisdk",
            package: "@ai-sdk/openai-compatible",
            url: "https://api.accurecode.ai/api/gateway",
          },
        })
        catalog.provider.update(accure.id, (draft) => {
          draft.endpoint = accure.endpoint
        })
        const custom = provider("custom-accure", {
          endpoint: { type: "aisdk", package: "accure" },
        })
        catalog.provider.update(custom.id, (draft) => {
          draft.endpoint = custom.endpoint
        })
      })

      expect((yield* catalog.provider.get(ProviderV2.ID.make("accure"))).options.headers).toEqual({
        "HTTP-Referer": "https://accure.ai/",
        "X-Title": "Accure Code", // accurecode_change
      })
      expect((yield* catalog.provider.get(ProviderV2.ID.make("custom-accure"))).options.headers).toEqual({})
    }),
  )

  // accurecode_change start
  it.effect("routes the Accure catalog through the Accure Gateway SDK", () =>
    withEnv({ ACCURECODE_API_KEY: undefined, ACCURECODE_ORG_ID: undefined }, () =>
      Effect.gen(function* () {
        const plugin = yield* PluginV2.Service
        const catalog = yield* Catalog.Service
        yield* plugin.add(AccurePlugin)
        const load = yield* catalog.loader()
        yield* load((catalog) => {
          const item = provider("accure", {
            endpoint: {
              type: "aisdk",
              package: "@ai-sdk/openai-compatible",
              url: "https://api.accurecode.ai/api/gateway",
            },
            options: {
              headers: {},
              body: {},
              aisdk: { provider: { apiKey: "stored-token" }, request: {} },
            },
          })
          catalog.provider.update(item.id, (draft) => {
            draft.endpoint = item.endpoint
            draft.options = item.options
          })
        })
        const updated = yield* catalog.provider.get(ProviderV2.ID.make("accure"))

        expect(updated.endpoint).toEqual({
          type: "aisdk",
          package: "@accurecode/accure-gateway",
          url: "https://api.accurecode.ai/api/openrouter",
        })
        expect(updated.options.aisdk.provider.accurecodeToken).toBe("stored-token")

        const result = yield* plugin.trigger(
          "aisdk.sdk",
          {
            model: model("accure", "accure-auto/free"),
            package: "@accurecode/accure-gateway",
            options: updated.options.aisdk.provider,
          },
          {},
        )
        expect(result.sdk).toBeDefined()
        expect(typeof result.sdk.languageModel).toBe("function")
        expect(typeof result.sdk.anthropic).toBe("function")
      }),
    ),
  )

  it.effect("keeps authenticated credentials ahead of inherited environment keys", () =>
    withEnv({ ACCURECODE_API_KEY: "environment-token", ACCURECODE_ORG_ID: "environment-org" }, () =>
      Effect.gen(function* () {
        const plugin = yield* PluginV2.Service
        const catalog = yield* Catalog.Service
        yield* plugin.add(AccurePlugin)
        const load = yield* catalog.loader()
        yield* load((catalog) => {
          const item = provider("accure", {
            enabled: { via: "account", service: "accure" },
            options: {
              headers: {},
              body: {},
              aisdk: {
                provider: { apiKey: "authenticated-token", accurecodeOrganizationId: "authenticated-org" },
                request: {},
              },
            },
          })
          catalog.provider.update(item.id, (draft) => {
            draft.enabled = item.enabled
            draft.options = item.options
          })
        })
        const result = yield* catalog.provider.get(ProviderV2.ID.make("accure"))

        expect(result.enabled).toEqual({ via: "account", service: "accure" })
        expect(result.options.aisdk.provider.accurecodeToken).toBe("authenticated-token")
        expect(result.options.aisdk.provider.accurecodeOrganizationId).toBe("environment-org")
      }),
    ),
  )

  it.effect("keeps anonymous Accure models available without credentials", () =>
    withEnv({ ACCURECODE_API_KEY: undefined, ACCURECODE_ORG_ID: undefined }, () =>
      Effect.gen(function* () {
        const plugin = yield* PluginV2.Service
        const catalog = yield* Catalog.Service
        yield* plugin.add(AccurePlugin)
        const load = yield* catalog.loader()
        yield* load((catalog) => catalog.provider.update(ProviderV2.ID.make("accure"), () => {}))
        const result = yield* catalog.provider.get(ProviderV2.ID.make("accure"))

        expect(result.enabled).toEqual({ via: "custom", data: { anonymous: true } })
        expect(result.options.aisdk.provider.accurecodeToken).toBe("anonymous")
      }),
    ),
  )
  // accurecode_change end
})
