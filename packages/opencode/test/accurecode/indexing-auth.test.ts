import { describe, expect, test } from "bun:test"
import {
  hasAccureIndexingAuth,
  resolveAccureIndexingAuth,
  shouldDefaultIndexingToAccure,
} from "../../src/accurecode/indexing-auth"

describe("Accure indexing auth resolution", () => {
  test("detects auth from explicit indexing Accure config", () => {
    const auth = resolveAccureIndexingAuth({
      config: { indexing: { accure: { apiKey: "idx-token", baseUrl: "https://idx.test", organizationId: "org_idx" } } },
    })

    expect(auth).toEqual({ apiKey: "idx-token", baseUrl: "https://idx.test", organizationId: "org_idx" })
    expect(hasAccureIndexingAuth({ config: { indexing: { accure: { apiKey: "idx-token" } } } })).toBe(true)
  })

  test("detects auth from provider config, provider state, auth storage, and env", () => {
    expect(
      resolveAccureIndexingAuth({ config: { provider: { accure: { options: { apiKey: "cfg-token" } } } } }).apiKey,
    ).toBe("cfg-token")
    expect(resolveAccureIndexingAuth({ provider: { options: { accurecodeToken: "provider-token" } } }).apiKey).toBe(
      "provider-token",
    )
    expect(
      resolveAccureIndexingAuth({ auth: { type: "oauth", access: "oauth-token", accountId: "org_oauth" } }),
    ).toEqual({
      apiKey: "oauth-token",
      organizationId: "org_oauth",
    })
    expect(
      resolveAccureIndexingAuth({ env: { ACCURECODE_API_KEY: "env-token", ACCURECODE_ORG_ID: "org_env" } }),
    ).toEqual({
      apiKey: "env-token",
      organizationId: "org_env",
    })
  })

  test("defaults to Accure only when no provider or other embedder config is present", () => {
    const auth = { apiKey: "accure-token" }

    expect(shouldDefaultIndexingToAccure({}, auth)).toBe(true)
    expect(shouldDefaultIndexingToAccure({ provider: "openai" }, auth)).toBe(false)
    expect(shouldDefaultIndexingToAccure({ openai: { apiKey: "openai-key" } }, auth)).toBe(false)
    expect(shouldDefaultIndexingToAccure({ ollama: { baseUrl: "http://localhost:11434" } }, auth)).toBe(false)
  })
})
