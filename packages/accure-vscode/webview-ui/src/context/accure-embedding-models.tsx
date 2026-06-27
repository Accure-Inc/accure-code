import { createContext, createSignal, onCleanup, useContext, type Accessor, type ParentComponent } from "solid-js"
import {
  EMPTY_ACCURECODE_EMBEDDING_MODEL_CATALOG,
  type AccureEmbeddingModelCatalog,
} from "@accurecode/accure-indexing/embedding-models"
import { useVSCode } from "./vscode"
import type { ExtensionMessage } from "../types/messages"

type AccureEmbeddingModelsContextValue = {
  catalog: Accessor<AccureEmbeddingModelCatalog>
}

export const AccureEmbeddingModelsContext = createContext<AccureEmbeddingModelsContextValue>()

export const AccureEmbeddingModelsProvider: ParentComponent = (props) => {
  const vscode = useVSCode()
  const [catalog, setCatalog] = createSignal<AccureEmbeddingModelCatalog>(EMPTY_ACCURECODE_EMBEDDING_MODEL_CATALOG)

  const unsubscribe = vscode.onMessage((message: ExtensionMessage) => {
    if (message.type !== "accureEmbeddingModelsLoaded") return
    setCatalog(message.catalog)
  })

  vscode.postMessage({ type: "requestAccureEmbeddingModels" })

  onCleanup(unsubscribe)

  return (
    <AccureEmbeddingModelsContext.Provider value={{ catalog }}>{props.children}</AccureEmbeddingModelsContext.Provider>
  )
}

export function useAccureEmbeddingModels(): AccureEmbeddingModelsContextValue {
  const context = useContext(AccureEmbeddingModelsContext)
  if (!context) {
    throw new Error("useAccureEmbeddingModels must be used within a AccureEmbeddingModelsProvider")
  }
  return context
}
