import { describe, expect, it } from "bun:test"

import {
  disabledProviderOptions,
  providersWithAccureFallback,
  visibleConnectedIds,
} from "../../webview-ui/src/components/settings/provider-visibility"

describe("visibleConnectedIds", () => {
  it("hides Accure from the connected list when auth is missing", () => {
    const ids = visibleConnectedIds(["accure", "openrouter"], { openrouter: "api" })

    expect(ids).toEqual(["openrouter"])
  })

  it("keeps Accure in the connected list when auth exists", () => {
    const ids = visibleConnectedIds(["accure", "openrouter"], { accure: "oauth", openrouter: "api" })

    expect(ids).toEqual(["accure", "openrouter"])
  })

  it("leaves non-Accure providers untouched", () => {
    const ids = visibleConnectedIds(["anthropic"], {})

    expect(ids).toEqual(["anthropic"])
  })
})

describe("disabledProviderOptions", () => {
  it("includes Accure and excludes already disabled providers", () => {
    const options = disabledProviderOptions(
      {
        accure: { id: "accure", name: "Accure Gateway", env: [], models: {} },
        openai: { id: "openai", name: "OpenAI", env: [], models: {} },
        anthropic: { id: "anthropic", name: "Anthropic", env: [], models: {} },
      },
      ["openai"],
    )

    expect(options).toEqual([
      { value: "accure", label: "Accure Gateway" },
      { value: "anthropic", label: "Anthropic" },
    ])
  })

  it("sorts options by provider name", () => {
    const options = disabledProviderOptions(
      {
        zed: { id: "zed", name: "Zed", env: [], models: {} },
        alpha: { id: "alpha", name: "Alpha", env: [], models: {} },
      },
      [],
    )

    expect(options).toEqual([
      { value: "alpha", label: "Alpha" },
      { value: "zed", label: "Zed" },
    ])
  })
})

describe("providersWithAccureFallback", () => {
  it("adds Accure when backend providers omit it", () => {
    const providers = providersWithAccureFallback({
      anthropic: { id: "anthropic", name: "Anthropic", env: [], models: {} },
    })

    expect(providers.accure?.name).toBe("Accure Gateway")
    expect(providers.anthropic?.name).toBe("Anthropic")
  })

  it("keeps the backend Accure provider when present", () => {
    const providers = providersWithAccureFallback({
      accure: { id: "accure", name: "Custom Accure Name", env: [], models: {} },
    })

    expect(providers.accure?.name).toBe("Custom Accure Name")
  })
})
