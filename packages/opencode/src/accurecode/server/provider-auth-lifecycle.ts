import { InstanceStore } from "@/project/instance-store"
import { ModelCache } from "@/provider/model-cache"
import { Effect } from "effect"

export const disposeAllInstancesAfterProviderAuthCallback = Effect.fn(
  "AccureServer.disposeAllInstancesAfterProviderAuthCallback",
)(function* () {
  const store = yield* InstanceStore.Service
  yield* store.disposeAll()
})

export const invalidateAfterProviderAuthChange = Effect.fn("AccureServer.invalidateAfterProviderAuthChange")(function* (
  providerID: string,
) {
  const cache = yield* ModelCache.Service
  yield* cache.clear(providerID)
  yield* disposeAllInstancesAfterProviderAuthCallback()
})
