import { createAccure, ACCURECODE_OPENROUTER_BASE } from "@accurecode/accure-gateway" // accurecode_change
import { Effect } from "effect"
import { PluginV2 } from "../../plugin"
import { ProviderV2 } from "../../provider" // accurecode_change

const id = ProviderV2.ID.make("accure") // accurecode_change

export const AccurePlugin = PluginV2.define({
  id: PluginV2.ID.make("accure"),
  effect: Effect.gen(function* () {
    return {
      "catalog.transform": Effect.fn(function* (evt) {
        for (const item of evt.data) {
          if (item.provider.id !== id) continue // accurecode_change
          evt.provider.update(item.provider.id, (provider) => {
            // accurecode_change start
            const options = provider.options.aisdk.provider
            const token = options.accurecodeToken ?? options.apiKey ?? process.env.ACCURECODE_API_KEY
            const org = process.env.ACCURECODE_ORG_ID ?? options.accurecodeOrganizationId

            provider.endpoint = {
              type: "aisdk",
              package: "@accurecode/accure-gateway",
              url: ACCURECODE_OPENROUTER_BASE,
            }
            // accurecode_change end
            provider.options.headers["HTTP-Referer"] = "https://accure.ai/"
            // accurecode_change start
            provider.options.headers["X-Title"] = "Accure Code"
            options.accurecodeToken = token ?? "anonymous"
            if (org) options.accurecodeOrganizationId = org
            if (!provider.enabled) provider.enabled = { via: "custom", data: { anonymous: true } }
            // accurecode_change end
          })
        }
      }),
      // accurecode_change start
      "aisdk.sdk": Effect.fn(function* (evt) {
        if (evt.model.providerID !== id) return
        evt.sdk = createAccure(evt.options)
      }),
      // accurecode_change end
    }
  }),
})
