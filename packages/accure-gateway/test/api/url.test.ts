import { describe, expect, test } from "bun:test"
import { resolveAccureGatewayBaseUrl, resolveAccureOpenRouterBaseUrl } from "../../src/api/url"

describe("Accure API URL resolvers", () => {
  test("resolves production route bases", () => {
    expect(resolveAccureGatewayBaseUrl()).toBe("https://api.accurecode.ai/api/gateway/")
    expect(resolveAccureOpenRouterBaseUrl()).toBe("https://api.accurecode.ai/api/openrouter/")
  })

  test("normalizes root API base overrides", () => {
    expect(resolveAccureGatewayBaseUrl({ baseURL: "https://example.test" })).toBe("https://example.test/api/gateway/")
    expect(resolveAccureOpenRouterBaseUrl({ baseURL: "https://example.test/" })).toBe(
      "https://example.test/api/openrouter/",
    )
  })

  test("replaces existing Accure API route paths", () => {
    expect(resolveAccureGatewayBaseUrl({ baseURL: "https://example.test/api/openrouter/" })).toBe(
      "https://example.test/api/gateway/",
    )
    expect(resolveAccureOpenRouterBaseUrl({ baseURL: "https://example.test/api/gateway/" })).toBe(
      "https://example.test/api/openrouter/",
    )
  })

  test("preserves path prefixes before api", () => {
    expect(resolveAccureGatewayBaseUrl({ baseURL: "https://example.test/dev/api/openrouter/" })).toBe(
      "https://example.test/dev/api/gateway/",
    )
    expect(resolveAccureOpenRouterBaseUrl({ baseURL: "https://example.test/dev" })).toBe(
      "https://example.test/dev/api/openrouter/",
    )
  })

  test("strips search and hash components", () => {
    expect(resolveAccureGatewayBaseUrl({ baseURL: "https://example.test/api/openrouter/?x=1#frag" })).toBe(
      "https://example.test/api/gateway/",
    )
  })

  test("prefers token-derived URL when token contains one", () => {
    expect(resolveAccureGatewayBaseUrl({ baseURL: "https://fallback.test", token: "https://token.test:opaque" })).toBe(
      "https://token.test/api/gateway/",
    )
  })

  test("resolves child endpoint URLs", () => {
    expect(
      new URL("embedding-models", resolveAccureGatewayBaseUrl({ baseURL: "https://example.test" })).toString(),
    ).toBe("https://example.test/api/gateway/embedding-models")
  })
})
