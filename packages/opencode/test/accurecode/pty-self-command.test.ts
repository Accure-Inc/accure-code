import { describe, expect, test } from "bun:test"
import { AccurePtySelfCommand } from "../../src/accurecode/pty/self-command"

describe("pty self-command", () => {
  test("does not forward bundled bun entrypoints", () => {
    const proc = {
      argv: ["/tmp/accure", "/$bunfs/root/src/index.js"],
      execArgv: ["--user-agent=accure/test", "--use-system-ca", "--"],
      execPath: "/tmp/accure",
      cwd: "/tmp",
    }

    const cmd = AccurePtySelfCommand.command(proc)
    expect(cmd).toStrictEqual({ command: "/tmp/accure", args: [] })
    expect(AccurePtySelfCommand.resolve({ command: "accure", cwd: "/tmp/project" }, cmd)).toStrictEqual({
      command: "/tmp/accure",
      args: [],
      cwd: "/tmp/project",
    })
    expect(
      AccurePtySelfCommand.command({
        ...proc,
        argv: ["C:/tmp/accure.exe", "B:/~BUN/root/src/index.js"],
      }).args,
    ).toStrictEqual([])
    expect(
      AccurePtySelfCommand.command({
        ...proc,
        argv: ["C:/tmp/accure.exe", "b:\\~BUN\\root\\src\\index.js"],
      }).args,
    ).toStrictEqual([])
  })

  test("forwards source entrypoints", () => {
    const cmd = AccurePtySelfCommand.command({
      argv: ["/tmp/bun", "/tmp/accure/src/index.ts"],
      execArgv: ["--conditions=browser", "--cwd", "packages/opencode"],
      execPath: "/tmp/bun",
      cwd: "/tmp/accure",
    })
    expect(cmd).toStrictEqual({
      command: "/tmp/bun",
      args: ["--conditions=browser", "/tmp/accure/src/index.ts"],
      cwd: "/tmp/accure",
    })
    expect(AccurePtySelfCommand.resolve({ command: "accure", cwd: "/tmp/project" }, cmd)).toStrictEqual({
      command: "/tmp/bun",
      args: ["--conditions=browser", "/tmp/accure/src/index.ts", "/tmp/project"],
      cwd: "/tmp/accure",
    })
  })
})
