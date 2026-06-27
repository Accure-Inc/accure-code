import { describe, expect, test } from "bun:test"
import { providerMetadata } from "../../src/accurecode/provider/metadata"

describe("providerMetadata", () => {
  test("returns shared provider key, icon, and priority metadata", () => {
    expect(providerMetadata("openai")).toEqual({
      noteKey: "settings.providers.note.openai",
      icon: "openai",
      priority: 3,
    })
  })

  test("maps github copilot aliases to stable metadata", () => {
    expect(providerMetadata("github-copilot-custom")).toEqual({
      noteKey: "settings.providers.note.copilot",
      icon: "github-copilot",
    })
  })

  test("uses the Accure icon for Accure Gateway", () => {
    expect(providerMetadata("accure")).toEqual({
      noteKey: "settings.providers.note.accurecode",
      icon: "accure",
      priority: 0,
    })
  })

  test("falls back to synthetic icon for unknown providers", () => {
    expect(providerMetadata("unknown-provider")).toEqual({ icon: "synthetic" })
  })
})
