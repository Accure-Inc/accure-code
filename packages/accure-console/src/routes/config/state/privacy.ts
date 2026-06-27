import type { Model, Provider } from "@accurecode/sdk/v2/client"

export function hasGateway(providers: Pick<Provider, "id">[]) {
  return providers.some((provider) => provider.id === "accure")
}

export function visible(provider: Pick<Provider, "id">, model: Pick<Model, "mayTrainOnYourPrompts">, privacy: boolean) {
  return !privacy || provider.id !== "accure" || model.mayTrainOnYourPrompts !== true
}
