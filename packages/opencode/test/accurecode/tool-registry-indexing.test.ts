import { afterEach, describe, expect, spyOn, test } from "bun:test"
import { Effect, Layer, Schema } from "effect"
import * as Log from "@opencode-ai/core/util/log"
import { Agent } from "../../src/agent/agent"
import { AccureIndexing } from "../../src/accurecode/indexing"
import { AccurecodeBootstrap } from "../../src/accurecode/bootstrap"
import { AccureSessions } from "../../src/accure-sessions/accure-sessions"
import { AccureToolRegistry } from "../../src/accurecode/tool/registry"
import { ModelID, ProviderID } from "../../src/provider/schema"
import { ToolRegistry } from "../../src/tool/registry"
import type * as Tool from "../../src/tool/tool"
import { Instance } from "../../src/accurecode/instance"
import { disposeAllInstances, provideTmpdirInstance } from "../fixture/fixture"
import * as CrossSpawnSpawner from "@opencode-ai/core/cross-spawn-spawner"
import { testEffect } from "../lib/effect"

const node = CrossSpawnSpawner.defaultLayer
const it = testEffect(Layer.mergeAll(Agent.defaultLayer, ToolRegistry.defaultLayer, node))
const ref = {
  providerID: ProviderID.make("test"),
  modelID: ModelID.make("test-model"),
}

afterEach(async () => {
  await disposeAllInstances()
})

describe("accurecode tool registry indexing", () => {
  const logger = Log.create({ service: "accurecode-tool-registry" })

  it.live("omits semantic_search without waiting for slow indexing startup", () =>
    provideTmpdirInstance(
      () =>
        Effect.gen(function* () {
          const avail = spyOn(AccureIndexing, "available").mockImplementation(() => new Promise<boolean>(() => {}))

          try {
            const registry = yield* ToolRegistry.Service
            const ids = yield* registry.ids()

            expect(ids).not.toContain("semantic_search")
            expect(ids).not.toContain("codesearch")
            expect(ids).toContain("question")
            expect(ids).toContain("read")
            expect(ids).toContain("suggest")
            expect(avail).not.toHaveBeenCalled()
          } finally {
            avail.mockRestore()
          }
        }),
      { git: true },
    ),
  )

  it.live("registers semantic search from config even when readiness throws", () =>
    provideTmpdirInstance(
      () =>
        Effect.gen(function* () {
          const err = new Error("ready failed")
          const ready = spyOn(AccureIndexing, "ready").mockImplementation(() => {
            throw err
          })
          const warn = spyOn(logger, "warn").mockImplementation(() => {})

          try {
            const registry = yield* ToolRegistry.Service
            const ids = yield* registry.ids()

            expect(ids).toContain("semantic_search")
            expect(ids).toContain("question")
            expect(ids).toContain("read")
            expect(ids).toContain("suggest")
            expect(warn).not.toHaveBeenCalled()
          } finally {
            ready.mockRestore()
            warn.mockRestore()
          }
        }),
      { git: true, config: { indexing: { enabled: true } } },
    ),
  )

  it.live("registers semantic search from config even when readiness rejects", () =>
    provideTmpdirInstance(
      () =>
        Effect.gen(function* () {
          const err = new Error("ready rejected")
          const ready = spyOn(AccureIndexing, "ready").mockImplementation(
            () => Promise.reject(err) as unknown as boolean,
          )
          const warn = spyOn(logger, "warn").mockImplementation(() => {})

          try {
            const registry = yield* ToolRegistry.Service
            const ids = yield* registry.ids()

            expect(ids).toContain("semantic_search")
            expect(ids).toContain("question")
            expect(ids).toContain("read")
            expect(ids).toContain("suggest")
            expect(warn).not.toHaveBeenCalled()
          } finally {
            ready.mockRestore()
            warn.mockRestore()
          }
        }),
      { git: true, config: { indexing: { enabled: true } } },
    ),
  )

  it.live("registers semantic_search when indexing is enabled", () =>
    provideTmpdirInstance(
      () =>
        Effect.gen(function* () {
          const ready = spyOn(AccureIndexing, "ready").mockReturnValue(true)

          try {
            const registry = yield* ToolRegistry.Service
            const ids = yield* registry.ids()

            expect(ids).toContain("semantic_search")
          } finally {
            ready.mockRestore()
          }
        }),
      { git: true, config: { indexing: { enabled: true } } },
    ),
  )

  it.live("omits semantic_search hint from glob and grep descriptions when indexing is not ready", () =>
    provideTmpdirInstance(
      () =>
        Effect.gen(function* () {
          const ready = spyOn(AccureIndexing, "ready").mockReturnValue(false)

          try {
            const agent = yield* Agent.Service
            const build = yield* agent.get("build")
            const registry = yield* ToolRegistry.Service
            const tools = yield* registry.tools({ ...ref, agent: build })
            const glob = tools.find((tool) => tool.id === "glob")?.description ?? ""
            const grep = tools.find((tool) => tool.id === "grep")?.description ?? ""

            expect(glob).not.toContain("semantic_search")
            expect(grep).not.toContain("semantic_search")
          } finally {
            ready.mockRestore()
          }
        }),
      { git: true },
    ),
  )

  it.live("includes semantic_search hint in glob and grep descriptions when indexing is enabled", () =>
    provideTmpdirInstance(
      () =>
        Effect.gen(function* () {
          const ready = spyOn(AccureIndexing, "ready").mockReturnValue(true)

          try {
            const agent = yield* Agent.Service
            const build = yield* agent.get("build")
            const registry = yield* ToolRegistry.Service
            const tools = yield* registry.tools({ ...ref, agent: build })
            const ids = tools.map((tool) => tool.id)
            const glob = tools.find((tool) => tool.id === "glob")?.description ?? ""
            const grep = tools.find((tool) => tool.id === "grep")?.description ?? ""

            expect(ids).toContain("semantic_search")
            expect(glob).toContain("semantic_search")
            expect(grep).toContain("semantic_search")
          } finally {
            ready.mockRestore()
          }
        }),
      { git: true, config: { indexing: { enabled: true } } },
    ),
  )

  test("enables semantic search from indexing configuration before the index is ready", () => {
    expect(
      AccureToolRegistry.indexing({
        indexing: { enabled: true },
      }),
    ).toBe(true)
    expect(
      AccureToolRegistry.indexing({
        indexing: { enabled: false },
      }),
    ).toBe(false)
    expect(AccureToolRegistry.indexing({}, { indexing: { enabled: true } })).toBe(true)
  })

  test("conditionally includes Accure registry extras", () => {
    const prev = process.env["ACCURECODE_CLIENT"]
    const def = (id: string): Tool.Def => ({
      id,
      description: id,
      parameters: Schema.String,
      execute: () => Effect.succeed({ title: id, output: id, metadata: {} }),
    })
    const tools = {
      codebase: def("codebase_search"),
      semantic: def("semantic_search"),
      recall: def("recall"),
      manager: def("agent_manager"),
      process: def("background_process"),
    }

    try {
      process.env["ACCURECODE_CLIENT"] = "cli"
      expect(AccureToolRegistry.extra(tools, {}).map((tool) => tool.id)).toEqual([
        "semantic_search",
        "recall",
        "background_process",
      ])
      expect(
        AccureToolRegistry.extra(tools, { experimental: { codebase_search: true } }).map((tool) => tool.id),
      ).toEqual(["codebase_search", "semantic_search", "recall", "background_process"])

      process.env["ACCURECODE_CLIENT"] = "vscode"
      expect(
        AccureToolRegistry.extra(tools, { experimental: { codebase_search: true } }).map((tool) => tool.id),
      ).toEqual(["codebase_search", "semantic_search", "recall", "background_process", "agent_manager"])
      expect(AccureToolRegistry.extra({ ...tools, semantic: undefined }, {}).map((tool) => tool.id)).toEqual([
        "recall",
        "background_process",
        "agent_manager",
      ])

      process.env["ACCURECODE_CLIENT"] = "desktop"
      expect(AccureToolRegistry.extra(tools, {}).map((tool) => tool.id)).toEqual(["semantic_search", "recall"])
    } finally {
      if (prev === undefined) delete process.env["ACCURECODE_CLIENT"]
      if (prev !== undefined) process.env["ACCURECODE_CLIENT"] = prev
    }
  })

  test("logs indexing bootstrap failures without blocking session bootstrap", async () => {
    const logger = Log.create({ service: "accurecode-bootstrap" })
    const err = new Error("indexing init failed")
    const calls: string[] = []
    const sessions = Layer.succeed(
      AccureSessions.Service,
      AccureSessions.Service.of({ init: () => Effect.sync(() => calls.push("sessions")) }),
    )
    const indexing = spyOn(AccureIndexing, "init").mockRejectedValue(err)
    const warn = spyOn(logger, "warn").mockImplementation(() => {})

    try {
      await Effect.runPromise(
        AccurecodeBootstrap.Service.use((svc) => svc.init()).pipe(
          Effect.provide(AccurecodeBootstrap.layer.pipe(Layer.provide(sessions))),
          Effect.scoped,
        ),
      )
      await new Promise((resolve) => setTimeout(resolve, 0))

      expect(calls).toEqual(["sessions"])
      expect(indexing).toHaveBeenCalledTimes(1)
      expect(warn).toHaveBeenCalledWith("indexing bootstrap failed", { err })
    } finally {
      indexing.mockRestore()
      warn.mockRestore()
    }
  })
})
