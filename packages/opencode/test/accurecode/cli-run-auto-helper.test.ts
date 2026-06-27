// accurecode_change - new file
import { describe, expect, test } from "bun:test"
import { AccureRunAuto } from "../../src/accurecode/cli/run-auto"

describe("AccureRunAuto", () => {
  test("tracks task child sessions without allowing unrelated sessions", () => {
    const state = AccureRunAuto.create("ses_root")

    expect(AccureRunAuto.allowed(state, "ses_root")).toBe(true)
    expect(AccureRunAuto.allowed(state, "ses_child")).toBe(false)

    AccureRunAuto.track(state, {
      type: "tool",
      tool: "task",
      sessionID: "ses_root",
      state: {
        metadata: {
          sessionId: "ses_child",
        },
      },
    })

    expect(AccureRunAuto.allowed(state, "ses_child")).toBe(true)
    expect(AccureRunAuto.allowed(state, "ses_other")).toBe(false)
  })

  test("ignores malformed or non-root task metadata", () => {
    const state = AccureRunAuto.create("ses_root")

    AccureRunAuto.track(state, {
      type: "tool",
      tool: "task",
      sessionID: "ses_root",
      state: {
        metadata: {
          sessionId: "",
        },
      },
    })
    AccureRunAuto.track(state, {
      type: "tool",
      tool: "task",
      sessionID: "ses_other",
      state: {
        metadata: {
          sessionId: "ses_wrong",
        },
      },
    })
    AccureRunAuto.track(state, {
      type: "text",
      sessionID: "ses_root",
      state: {},
    })

    expect(AccureRunAuto.allowed(state, "ses_wrong")).toBe(false)
    expect(AccureRunAuto.allowed(state, "")).toBe(false)
  })
})
