import { Config } from "@/config/config"
// accurecode_change start - preserve Accure API default model overlay
import { fetchDefaultModel } from "@accurecode/accure-gateway"
import { Auth } from "@/auth"
import { ModelID, ProviderID } from "@/provider/schema"
import { filterPromptTrainingModels, nonEmptyProviders, filterBedrockModels } from "@/accurecode/provider/model-filter"
// accurecode_change end
import { Provider } from "@/provider/provider"
import * as InstanceState from "@/effect/instance-state"
import { Effect } from "effect"
import { HttpApiBuilder, HttpApiError } from "effect/unstable/httpapi" // accurecode_change
import { InstanceHttpApi } from "../api"
import { markInstanceForDisposal } from "../lifecycle"

export const configHandlers = HttpApiBuilder.group(InstanceHttpApi, "config", (handlers) =>
  Effect.gen(function* () {
    const providerSvc = yield* Provider.Service
    const configSvc = yield* Config.Service

    const get = Effect.fn("ConfigHttpApi.get")(function* () {
      return yield* configSvc.get()
    })

    const update = Effect.fn("ConfigHttpApi.update")(function* (ctx) {
      yield* configSvc.update(ctx.payload)
      yield* markInstanceForDisposal(yield* InstanceState.context)
      return ctx.payload
    })

    // accurecode_change start
    const warnings = Effect.fn("ConfigHttpApi.warnings")(function* () {
      return yield* configSvc.warnings()
    })
    // accurecode_change end

    const providers = Effect.fn("ConfigHttpApi.providers")(function* () {
      // accurecode_change start
      const config = yield* configSvc.get()
      const providers = filterBedrockModels(filterPromptTrainingModels( // accurecode_change
        yield* providerSvc.list(),
        config.hide_prompt_training_models === true,
      ))
      const defaults = Provider.defaultModelIDs(nonEmptyProviders(providers))
      // accurecode_change end

      // accurecode_change start - Fetch default model from Accure API when the accure provider is available.
      if (providers[ProviderID.accure]) {
        const auth = yield* Auth.Service
        const info = yield* auth.get("accure").pipe(Effect.mapError(() => new HttpApiError.Unauthorized({}))) // accurecode_change
        const token = info?.type === "oauth" ? info.access : info?.key
        const organizationId = info?.type === "oauth" ? info.accountId : undefined
        const model = yield* Effect.promise(() => fetchDefaultModel(token, organizationId))
        if (model && providers[ProviderID.accure]?.models[model])
          defaults[ProviderID.accure] = ModelID.make(model)
      }
      // accurecode_change end

      return {
        providers: Object.values(providers).map(Provider.toPublicInfo),
        default: defaults,
      }
    })

    return handlers
      .handle("get", get)
      .handle("update", update)
      .handle("warnings", warnings)
      .handle("providers", providers) // accurecode_change
  }),
)
