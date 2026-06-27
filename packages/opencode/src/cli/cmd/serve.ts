import { Effect } from "effect"
import { Server } from "../../server/server"
import { effectCmd } from "../effect-cmd"
import { withNetworkOptions, resolveNetworkOptions } from "../network"
import { Flag } from "@opencode-ai/core/flag/flag"
import { InstanceRuntime } from "../../project/instance-runtime" // accurecode_change

export const ServeCommand = effectCmd({
  command: "serve",
  builder: (yargs) => withNetworkOptions(yargs),
  describe: "starts a headless accure server",
  // Server loads instances per-request via x-accure-directory header — no
  // need for an ambient project InstanceContext at startup.
  instance: false, // accurecode_change
  handler: Effect.fn("Cli.serve")(function* (args) {
    if (!Flag.ACCURECODE_SERVER_PASSWORD) {
      console.log("Warning: ACCURECODE_SERVER_PASSWORD is not set; server is unsecured.")
    }
    const opts = yield* resolveNetworkOptions(args)
    const server = yield* Effect.promise(() => Server.listen(opts))

    // accurecode_change start
    const urls = server.urls

    console.log(`accure server listening on ${urls.bind}`)
    if (urls.network) {
      console.log(`  Local:   ${urls.local}`)
      console.log(`  Network: ${urls.network}`)
    }
    // accurecode_change end

    // accurecode_change start - graceful signal shutdown
    // yield* Effect.never
    yield* Effect.promise(
      () =>
        new Promise<void>((resolve) => {
          const shutdown = async () => {
            try {
              await InstanceRuntime.disposeAllInstances()
              await server.stop(true)
            } finally {
              resolve()
            }
          }
          process.once("SIGTERM", shutdown)
          process.once("SIGINT", shutdown)
          process.once("SIGHUP", shutdown)
        }),
    )
    // accurecode_change end
  }),
})
