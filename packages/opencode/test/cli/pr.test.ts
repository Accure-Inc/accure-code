// accurecode_change - new file
import { expect, test } from "bun:test"
import { cliCommand } from "../../src/cli/cmd/pr"

test("cliCommand uses the current script when argv[1] is a file path", () => {
  const result = cliCommand({
    execPath: "/usr/bin/node",
    argv: ["/usr/bin/node", "/tmp/accure.js", "pr", "1"],
    exists: (file) => file === "/tmp/accure.js",
  })

  expect(result).toEqual(["/usr/bin/node", "/tmp/accure.js"])
})

test("cliCommand falls back to execPath when argv[1] is a subcommand", () => {
  const result = cliCommand({
    execPath: "/usr/local/bin/accure",
    argv: ["/usr/local/bin/accure", "pr", "1"],
    exists: () => false,
  })

  expect(result).toEqual(["/usr/local/bin/accure"])
})

test("cliCommand ignores subcommand token even when it exists on disk", () => {
  const result = cliCommand({
    execPath: "/usr/local/bin/accure",
    argv: ["/usr/local/bin/accure", "pr", "1"],
    exists: (file) => file === "pr",
  })

  expect(result).toEqual(["/usr/local/bin/accure"])
})

test("cliCommand falls back to execPath when argv[1] is missing", () => {
  const result = cliCommand({
    execPath: "/usr/local/bin/accure",
    argv: ["/usr/local/bin/accure"],
    exists: () => false,
  })

  expect(result).toEqual(["/usr/local/bin/accure"])
})

test("cliCommand falls back to execPath for bun virtual script paths", () => {
  const unix = cliCommand({
    execPath: "/tmp/accure",
    argv: ["/tmp/accure", "/$bunfs/root/src/index.js", "pr", "1"],
    exists: () => true,
  })

  const win = cliCommand({
    execPath: "C:/tmp/accure.exe",
    argv: ["C:/tmp/accure.exe", "B:/~BUN/root/src/index.js", "pr", "1"],
    exists: () => true,
  })

  expect(unix).toEqual(["/tmp/accure"])
  expect(win).toEqual(["C:/tmp/accure.exe"])
})
