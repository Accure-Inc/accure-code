import { Effect } from "effect"
import { HttpApiBuilder, HttpApiError } from "effect/unstable/httpapi"
import { EffectBridge } from "@/effect/bridge"
import { AccureSessions } from "@/accure-sessions/accure-sessions"
import { InstanceHttpApi } from "@/server/routes/instance/httpapi/api"

export const remoteHandlers = HttpApiBuilder.group(InstanceHttpApi, "remote", (handlers) =>
  Effect.gen(function* () {
    const enable = Effect.fn("RemoteHttpApi.enable")(function* () {
      yield* EffectBridge.fromPromise(() => AccureSessions.enableRemote()).pipe(
        Effect.catchCause(() => Effect.fail(new HttpApiError.Unauthorized())),
      )
      return AccureSessions.remoteStatus()
    })

    const disable = Effect.fn("RemoteHttpApi.disable")(function* () {
      yield* Effect.sync(() => AccureSessions.disableRemote())
      return AccureSessions.remoteStatus()
    })

    const status = Effect.fn("RemoteHttpApi.status")(function* () {
      return yield* Effect.sync(() => AccureSessions.remoteStatus())
    })

    return handlers.handle("enable", enable).handle("disable", disable).handle("status", status)
  }),
)
