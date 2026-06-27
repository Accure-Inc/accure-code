// accurecode_change - new file
// Tests that unauthenticated Accure models are assembled with paid models and autoloaded anonymously.

import { expect } from "bun:test"
import { AppFileSystem } from "@opencode-ai/core/filesystem"
import { ModelsDev } from "../../src/provider/models"
import * as CoreModels from "@opencode-ai/core/models-dev"
import { Effect, Layer } from "effect"
import { FetchHttpClient } from "effect/unstable/http"
import { accureCustomLoaders, patchAccureProviderPrivacy } from "../../src/accurecode/provider/provider"
import { Auth } from "../../src/auth"
import { ModelCache } from "../../src/provider/model-cache"
import { Provider } from "../../src/provider/provider"
import { TestConfig } from "../fixture/config"
import { testEffect } from "../lib/effect"
import { provideInstance } from "../fixture/fixture"

const input = {
  id: "accure",
  env: ["ACCURECODE_API_KEY"],
  models: {
    "free-model": {
      id: "free-model",
      name: "Free Model",
      cost: { input: 0, output: 0 },
      limit: { context: 128000, output: 4096 },
    },
    "paid-model": {
      id: "paid-model",
      name: "Paid Model",
      cost: { input: 1, output: 2 },
      limit: { context: 128000, output: 4096 },
    },
  },
}

const seed: Record<string, ModelsDev.Provider> = {
  apertis: {
    id: "apertis",
    name: "Apertis",
    env: ["APERTIS_API_KEY"],
    models: {},
  },
}

const auth = Layer.mock(Auth.Service)({
  get: () => Effect.succeed(undefined),
})

const files = Layer.effect(
  AppFileSystem.Service,
  Effect.gen(function* () {
    const fs = yield* AppFileSystem.Service
    return AppFileSystem.Service.of({
      ...fs,
      readJson: () => Effect.succeed(seed),
      stat: () => fs.stat(import.meta.path),
    })
  }),
).pipe(Layer.provide(AppFileSystem.defaultLayer))

function load(data?: { auth?: object; config?: object; env?: Record<string, string | undefined> }) {
  return accureCustomLoaders({
    auth: () => Effect.succeed(data?.auth),
    config: () => Effect.succeed(data?.config ?? {}),
    env: () => Effect.succeed(data?.env ?? {}),
    get: () => Effect.succeed(undefined),
  }).accure(input)
}

function layer() {
  const cfg = TestConfig.layer()
  const models = Layer.succeed(
    ModelCache.AccureModelsService,
    ModelCache.AccureModelsService.of({
      fetch: () =>
        Effect.succeed({
          models: {
            "free-model": {
              id: "free-model",
              name: "Free Model",
              cost: { input: 0, output: 0 },
              limit: { context: 128000, output: 4096 },
            },
            "paid-model": {
              id: "paid-model",
              name: "Paid Model",
              cost: { input: 1, output: 2 },
              isFree: false,
              mayTrainOnYourPrompts: true,
              limit: { context: 128000, output: 4096 },
            },
          },
        }),
    }),
  )
  const cache = Layer.fresh(ModelCache.layer).pipe(
    Layer.provide(FetchHttpClient.layer),
    Layer.provide(cfg),
    Layer.provide(auth),
    Layer.provide(models),
  )
  const core = Layer.succeed(
    CoreModels.Service,
    CoreModels.Service.of({
      get: () => Effect.succeed(seed),
      refresh: () => Effect.void,
    }),
  )
  return Layer.fresh(ModelsDev.layer).pipe(
    Layer.provide(core),
    Layer.provide(FetchHttpClient.layer),
    Layer.provide(files),
    Layer.provide(cfg),
    Layer.provide(auth),
    Layer.provide(cache),
  )
}

const it = testEffect(Layer.empty)

it.live("assembles paid Accure models without auth", () =>
  Effect.gen(function* () {
    const providers = yield* ModelsDev.Service.use((models) => models.get()).pipe(
      Effect.provide(layer()),
      provideInstance(process.cwd()),
    )
    const accure = Provider.fromModelsDevProvider(providers.accure)

    expect(accure.models["paid-model"]).toMatchObject({
      id: "paid-model",
      providerID: "accure",
      cost: { input: 1, output: 2 },
      isFree: false,
      mayTrainOnYourPrompts: true,
    })
  }),
)

it.live("does not infer free status from zero catalog prices", () =>
  Effect.gen(function* () {
    const providers = yield* ModelsDev.Service.use((models) => models.get()).pipe(
      Effect.provide(layer()),
      provideInstance(process.cwd()),
    )
    const accure = Provider.fromModelsDevProvider(providers.accure)

    expect(accure.models["free-model"].isFree).toBeUndefined()
  }),
)

it.effect("enables a paid catalog anonymously without auth", () =>
  Effect.gen(function* () {
    const result = yield* load()
    expect(result.autoload).toBe(true)
    expect(result.options).toEqual({ apiKey: "anonymous" })
  }),
)

it.effect("enables a paid catalog when config apiKey is present", () =>
  Effect.gen(function* () {
    const result = yield* load({ config: { provider: { accure: { options: { apiKey: "test-key" } } } } })
    expect(result.autoload).toBe(true)
    expect(result.options).toEqual({})
  }),
)

it.effect("denies provider data collection when prompt-training models are hidden", () =>
  Effect.gen(function* () {
    const result = yield* load({ config: { hide_prompt_training_models: true } })
    expect(result.options).toEqual({ apiKey: "anonymous", dataCollection: "deny" })
  }),
)

it.effect("keeps data collection denied after configured options are applied", () =>
  Effect.sync(() => {
    const provider = { options: { dataCollection: "allow", baseURL: "https://api.accurecode.ai" } }
    patchAccureProviderPrivacy(provider, { hide_prompt_training_models: true })
    expect(provider.options).toEqual({ dataCollection: "deny", baseURL: "https://api.accurecode.ai" })
  }),
)

it.effect("enables a paid catalog when auth exists", () =>
  Effect.gen(function* () {
    const result = yield* load({ auth: { type: "api", key: "test-key" } })
    expect(result.autoload).toBe(true)
    expect(result.options).toEqual({})
  }),
)

function loadAccureModels(data?: { auth?: object; config?: object; env?: Record<string, string | undefined> }) {
  return accureCustomLoaders({
    auth: () => Effect.succeed(data?.auth),
    config: () => Effect.succeed(data?.config ?? {}),
    env: () => Effect.succeed(data?.env ?? {}),
    get: () => Effect.succeed(undefined),
  })["accure-models"](input)
}

it.effect("accure-models custom loader uses default key for default URL", () =>
  Effect.gen(function* () {
    const result = yield* loadAccureModels()
    expect(result.options!.baseURL).toBe("http://jenkins.accure.ai:9006/v1/")
    expect(result.options!.apiKey).toBe("sk-Fs75pLJeP7zb3bqtLSJLYxE__IuC8IJfOOf_EI7_Vy8-v4")
  }),
)

it.effect("accure-models custom loader uses empty key for custom URL when unauthenticated", () =>
  Effect.gen(function* () {
    const result = yield* loadAccureModels({
      config: { provider: { "accure-models": { options: { baseURL: "https://atm.accure.ai/v1" } } } }
    })
    expect(result.options!.baseURL).toBe("https://atm.accure.ai/v1/")
    expect(result.options!.apiKey).toBe("")
  }),
)

it.effect("accure-models custom loader uses custom key for custom URL when authenticated", () =>
  Effect.gen(function* () {
    const result = yield* loadAccureModels({
      config: { provider: { "accure-models": { options: { baseURL: "https://atm.accure.ai/v1" } } } },
      auth: { type: "api", key: "my-custom-token" }
    })
    expect(result.options!.baseURL).toBe("https://atm.accure.ai/v1/")
    expect(result.options!.apiKey).toBe("my-custom-token")
  }),
)
