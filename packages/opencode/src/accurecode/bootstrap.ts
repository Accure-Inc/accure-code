import { Cause, Context, Effect, Layer } from "effect"
import { EffectBridge } from "@/effect/bridge"
import { AccureSessions } from "@/accure-sessions/accure-sessions"
import * as Log from "@opencode-ai/core/util/log"
import { Global } from "@opencode-ai/core/global"
import { InstallationVersion } from "@opencode-ai/core/installation/version"
import path from "node:path"
import { Bus } from "@/bus"
import { SessionExport } from "@/accurecode/session-export"
import { createWorkspaceProvider } from "@/accurecode/session-export/workspace-provider"
import { Instance } from "@/accurecode/instance"
import { Identity } from "@accurecode/accure-telemetry"

const log = Log.create({ service: "accurecode-bootstrap" })

export namespace AccurecodeBootstrap {
  export interface Interface {
    readonly init: () => Effect.Effect<void, unknown>
  }

  export class Service extends Context.Service<Service, Interface>()("@accurecode/Bootstrap") {}

  export const layer = Layer.effect(
    Service,
    Effect.gen(function* () {
      const sessions = yield* AccureSessions.Service

      const init = Effect.fn("AccurecodeBootstrap.init")(function* () {
        yield* sessions.init()
        // accurecode_change start - session export bootstrap
        yield* Effect.gen(function* () {
          const anon = yield* EffectBridge.fromPromise(() =>
            Identity.getMachineId().catch((err) => {
              log.warn("session export identity failed", { err })
              return undefined
            }),
          )
          SessionExport.init({
            agentVersion: InstallationVersion,
            anonId: anon,
            dbPath: path.join(Global.Path.data, "session-export.db"),
            workspaceKey: Instance.directory,
            subscribeAll: (cb) => Bus.subscribeAll(cb),
            snapshotProvider: createWorkspaceProvider({
              root: Instance.directory,
              statePath: path.join(Global.Path.data, "session-export-workspace.json"),
            }),
          })
        }).pipe(
          Effect.catchCause((cause) =>
            Effect.sync(() => log.warn("session export bootstrap failed", { err: Cause.squash(cause) })),
          ),
        )
        // accurecode_change end
        yield* EffectBridge.fromPromise(() =>
          import("@/accurecode/indexing").then((mod) => mod.AccureIndexing.init()),
        ).pipe(
          Effect.catchCause((cause) =>
            Effect.sync(() => log.warn("indexing bootstrap failed", { err: Cause.squash(cause) })),
          ),
          Effect.forkDetach,
        )
      })

      return Service.of({ init })
    }),
  )

  export const defaultLayer = layer.pipe(Layer.provide(AccureSessions.defaultLayer))
}
