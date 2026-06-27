import { describe, expect, test } from "bun:test"
import path from "path"

const root = path.join(__dirname, "..", "..")

describe("Accure OAuth branding", () => {
  test("Codex OAuth browser flow uses Accure branding", async () => {
    const src = await Bun.file(path.join(root, "src", "plugin", "codex.ts")).text()

    expect(src).toContain('originator: "accure"')
    expect(src).toContain('"User-Agent": `accure/${InstallationVersion}`')
    expect(src).toContain("return to Accure")
    expect(src).not.toContain('originator: "opencode"')
    expect(src).not.toContain("return to OpenCode")
  })

  test("MCP OAuth callback page uses Accure branding", async () => {
    const src = await Bun.file(path.join(root, "src", "mcp", "oauth-callback.ts")).text()

    expect(src).toContain("return to Accure")
    expect(src).not.toContain("return to OpenCode")
  })
})
