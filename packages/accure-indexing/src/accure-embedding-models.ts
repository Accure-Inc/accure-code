export type AccureEmbeddingModel = {
  id: string
  name: string
  dimension: number
  scoreThreshold: number
  note?: string
}

export type AccureEmbeddingModelCatalog = {
  defaultModel: string
  models: AccureEmbeddingModel[]
  aliases: Record<string, string>
}

export const EMPTY_ACCURECODE_EMBEDDING_MODEL_CATALOG: AccureEmbeddingModelCatalog = {
  defaultModel: "",
  models: [],
  aliases: {},
}

export function normalizeAccureEmbeddingModelId(
  model: string | undefined,
  catalog = EMPTY_ACCURECODE_EMBEDDING_MODEL_CATALOG,
) {
  if (!model) return undefined
  return catalog.aliases[model] ?? model
}

export function getAccureEmbeddingModel(model: string | undefined, catalog = EMPTY_ACCURECODE_EMBEDDING_MODEL_CATALOG) {
  const id = normalizeAccureEmbeddingModelId(model, catalog)
  return catalog.models.find((item) => item.id === id)
}

export function formatAccureEmbeddingModelLabel(model: AccureEmbeddingModel): string {
  const note = model.note ? `${model.note}, ` : ""
  return `${model.name} (${note}${model.dimension}d)`
}
