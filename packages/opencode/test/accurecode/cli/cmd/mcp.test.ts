import { describe, expect, test } from "bun:test"
import { AccurecodeMcpConfig } from "@/accurecode/cli/cmd/mcp"

const added = `{
  "permission": {
    "bash": "allow"
  },
  "mcp": {
    "linear": {
      "type": "remote",
      "url": "https://mcp.linear.app/mcp",
      "oauth": {}
    }
  },
}`

describe("AccurecodeMcpConfig.format", () => {
  test("writes strict JSON for accure.json", () => {
    const output = AccurecodeMcpConfig.format("/tmp/accure.json", added)

    expect(JSON.parse(output)).toEqual({
      permission: { bash: "allow" },
      mcp: {
        linear: {
          type: "remote",
          url: "https://mcp.linear.app/mcp",
          oauth: {},
        },
      },
    })
    expect(output).not.toEndWith(",\n}")
  })

  test("preserves JSONC formatting for accure.jsonc", () => {
    expect(AccurecodeMcpConfig.format("/tmp/accure.jsonc", added)).toBe(added)
  })
})
