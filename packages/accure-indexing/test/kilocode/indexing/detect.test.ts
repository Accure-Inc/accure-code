import { describe, expect, test } from "bun:test"
import { mkdtemp } from "node:fs/promises"
import { tmpdir } from "node:os"
import { hasIndexingPlugin, isIndexingPlugin, normalizePluginName } from "../../../src/detect"

describe("indexing plugin detection", () => {
  test("bundles detect module for browser targets", async () => {
    const dir = await mkdtemp(`${tmpdir()}/accure-indexing-detect-`)
    const result = await Bun.build({
      entrypoints: [new URL("../../../src/detect.ts", import.meta.url).pathname],
      minify: true,
      outdir: dir,
      target: "browser",
    })

    expect(result.success).toBe(true)
  })

  test("normalizes supported plugin forms", () => {
    expect(normalizePluginName("accure-indexing")).toBe("accure-indexing")
    expect(normalizePluginName("accure-indexing@1.2.3")).toBe("accure-indexing")
    expect(normalizePluginName("@kilocode/accure-indexing")).toBe("@kilocode/accure-indexing")
    expect(normalizePluginName("@kilocode/accure-indexing@1.2.3")).toBe("@kilocode/accure-indexing")
    expect(normalizePluginName("../../packages/accure-indexing")).toBe("@kilocode/accure-indexing")
    expect(normalizePluginName("file:///tmp/.opencode/plugin/accure-indexing.js")).toBe("accure-indexing")
    expect(normalizePluginName("file:///tmp/node_modules/@kilocode/accure-indexing/index.js")).toBe(
      "@kilocode/accure-indexing",
    )
    expect(normalizePluginName("file:///tmp/repo/packages/accure-indexing/src/index.ts")).toBe("@kilocode/accure-indexing")
  })

  test("detects supported indexing plugin specifiers", () => {
    const values = [
      "accure-indexing",
      "accure-indexing@1.2.3",
      "@kilocode/accure-indexing",
      "@kilocode/accure-indexing@1.2.3",
      "../../packages/accure-indexing",
      "file:///tmp/.opencode/plugin/accure-indexing.js",
      "file:///tmp/node_modules/@kilocode/accure-indexing/index.js",
      "file:///tmp/repo/packages/accure-indexing/src/index.ts",
    ]

    for (const value of values) {
      expect(isIndexingPlugin(value)).toBe(true)
    }
  })

  test("ignores unrelated plugin specifiers", () => {
    expect(isIndexingPlugin("@kilocode/accure-gateway")).toBe(false)
    expect(isIndexingPlugin("file:///tmp/.opencode/plugin/index.js")).toBe(false)
    expect(hasIndexingPlugin(["@kilocode/accure-gateway", "foo@1.0.0"])).toBe(false)
  })

  test("detects indexing plugin in merged plugin lists", () => {
    expect(
      hasIndexingPlugin(["@kilocode/accure-gateway", "file:///tmp/node_modules/@kilocode/accure-indexing/index.js"]),
    ).toBe(true)
  })
})
