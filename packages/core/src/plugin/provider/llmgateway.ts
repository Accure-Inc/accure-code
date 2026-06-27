import { Effect } from "effect"
import { PluginV2 } from "../../plugin"
import { ProviderV2 } from "../../provider" // accurecode_change

export const LLMGatewayPlugin = PluginV2.define({
  id: PluginV2.ID.make("llmgateway"),
  effect: Effect.gen(function* () {
    return {
      "catalog.transform": Effect.fn(function* (evt) {
        for (const item of evt.data) {
          if (item.provider.enabled === false) continue
          if (item.provider.endpoint.type !== "aisdk") continue
          if (item.provider.endpoint.package !== "@ai-sdk/openai-compatible") continue
          if (item.provider.endpoint.url !== "https://api.llmgateway.io/v1") continue
          if (item.provider.id !== ProviderV2.ID.make("llmgateway")) continue // accurecode_change
          evt.provider.update(item.provider.id, (provider) => {
            provider.options.headers["HTTP-Referer"] = "https://accure.ai/" // accurecode_change
            // accurecode_change start
            provider.options.headers["X-Title"] = "Accure Code"
            provider.options.headers["X-Source"] = "accure"
            // accurecode_change end
          })
        }
      }),
    }
  }),
})
