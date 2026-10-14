/**
 * AccureProviderConfigDialog — per-provider credential form shown inline
 * inside the model picker when a user selects an unconfigured provider.
 *
 * Supported providers:
 *   amazon-bedrock  → Model ID (editable), Access Key ID, Secret Access Key, Region
 *   accure-models   → Provider type, Model ID, Base URL, API Key (all pre-filled)
 *   generic         → URL, API Key
 */
import { Button } from "@accurecode/accure-ui/button"
import { TextField } from "@accurecode/accure-ui/text-field"
import { Spinner } from "@accurecode/accure-ui/spinner"
import { Component, createSignal, createMemo, Show, onCleanup } from "solid-js"
import { useVSCode } from "../../context/vscode"
import { createProviderAction } from "../../utils/provider-action"
import { useProvider } from "../../context/provider"
import type { EnrichedModel } from "../../context/provider"

interface Props {
  model: EnrichedModel
  onDone: (providerID: string, modelID: string) => void
  onCancel: () => void
}

// Per-model default model IDs for AccureIQx
const ACCURE_MODEL_IDS: Record<string, string> = {
  "atm-3": "ATM-3Q-120B",
  "atm-4": "ATM V4-0",
  "avm-3": "accureai/avm-3.1.1",
  "ATM-3Q-120B": "ATM-3Q-120B",
}

const ACCURE_DEFAULT_BASE_URL = "https://iqx.accure.ai/api/v1"
const ACCURE_DEFAULT_API_KEY = ""

function genId() {
  return Math.random().toString(36).slice(2)
}

const AccureProviderConfigDialog: Component<Props> = (props) => {
  const vscode = useVSCode()
  const action = createProviderAction(vscode)
  onCleanup(() => action.dispose())

  const { providers, authStates } = useProvider()

  const pid = () => props.model.providerID
  const mid = () => props.model.id
  const isBedrock = () => pid() === "amazon-bedrock"
  const isAccureModels = () => pid() === "accure-models"

  // ─── Bedrock fields ───────────────────────────────────────────────────────
  const savedOptions = () => (providers()[pid()] as any)?.options ?? {}
  const savedModelId = () => {
    const opts = savedOptions()
    return (opts[`${mid()}-modelId`] as string | undefined) ?? (opts.selectedModelId as string | undefined) ?? mid()
  }
  const [bedrockModelId, setBedrockModelId] = createSignal(savedModelId())
  const [accessKey, setAccessKey] = createSignal(savedOptions().accessKeyId ?? "")
  const [secretKey, setSecretKey] = createSignal(savedOptions().secretAccessKey ?? "")
  const [region, setRegion] = createSignal(savedOptions().region ?? "us-east-1")

  // ─── Accure Models fields (pre-filled) ───────────────────────────────────
  const savedBaseUrl = () => savedOptions().baseURL ?? ACCURE_DEFAULT_BASE_URL
  const savedProviderType = () => savedOptions().providerType ?? "vllm"
  const savedAccureModelId = () => {
    const opts = savedOptions()
    return (opts[`${mid()}-modelId`] as string | undefined) ?? (ACCURE_MODEL_IDS[mid()] ?? mid())
  }
  const savedApiKey = () => {
    if (authStates()[pid()] === "api") {
      return "••••••••"
    }
    return ACCURE_DEFAULT_API_KEY
  }

  const [providerType, setProviderType] = createSignal(savedProviderType())
  const [modelId, setModelId] = createSignal(savedAccureModelId())
  const [baseUrl, setBaseUrl] = createSignal(savedBaseUrl())
  const [apiKey, setApiKey] = createSignal(savedApiKey())

  // ─── Generic fields ───────────────────────────────────────────────────────
  const [url, setUrl] = createSignal(savedOptions().baseURL ?? "")
  const savedGenericApiKey = () => {
    if (authStates()[pid()] === "api") {
      return "••••••••"
    }
    return ""
  }
  const [genericApiKey, setGenericApiKey] = createSignal(savedGenericApiKey())

  const [saving, setSaving] = createSignal(false)
  const [error, setError] = createSignal("")

  const credentialsEmpty = () => !accessKey().trim() && !secretKey().trim()

  const title = createMemo(() => {
    if (isBedrock()) return "Configure Amazon Bedrock"
    if (isAccureModels()) return `Configure ${props.model.name}`
    return `Configure ${props.model.providerName}`
  })

  function validate(): string | null {
    if (isBedrock()) {
      if (!bedrockModelId().trim()) return "Model ID is required"
      if (!credentialsEmpty()) {
        if (!accessKey().trim()) return "AWS Access Key ID is required"
        if (!secretKey().trim()) return "AWS Secret Access Key is required"
      }
      return null
    }
    if (isAccureModels()) {
      if (!baseUrl().trim()) return "AccureIQx API URL is required"
      if (!baseUrl().trim().startsWith("http")) return "URL must start with http:// or https://"
      if (!modelId().trim()) return "Model ID is required"
      const keyTrimmed = apiKey().trim()
      if (!keyTrimmed && authStates()[pid()] !== "api") {
        return "AccureIQx User API Key is required"
      }
      return null
    }
    if (!url().trim()) return "URL is required"
    if (!url().trim().startsWith("http")) return "URL must start with http:// or https://"
    return null
  }

  function submit(e: SubmitEvent) {
    e.preventDefault()
    const err = validate()
    if (err) { setError(err); return }
    setError("")
    setSaving(true)

    const rid = genId()
    const options: Record<string, string> = {}
    let key: string | undefined

    if (isBedrock()) {

      const customModel = bedrockModelId().trim()
      if (customModel) {
        options[`${mid()}-modelId`] = customModel
        options.selectedModelId = customModel // Keep global fallback for backwards compatibility
      }

      if (!credentialsEmpty()) {
        // Save AWS credentials alongside the model ID
        options.accessKeyId = accessKey().trim()
        options.secretAccessKey = secretKey().trim()
        const r = region().trim()
        if (r) options.region = r
      }
    } else if (isAccureModels()) {
      let finalUrl = baseUrl().trim()
      if (typeof window !== "undefined" && (finalUrl.includes("localhost:3000") || finalUrl.includes("127.0.0.1:3000"))) {
        finalUrl = finalUrl.replace("localhost:3000", "host.docker.internal:3000").replace("127.0.0.1:3000", "host.docker.internal:3000")
      }
      options.baseURL = finalUrl
      options.providerType = providerType().trim()
      // Store per-model ID override so each model can point to a different vLLM model
      options[`${mid()}-modelId`] = modelId().trim()
      let keyTrimmed = apiKey().trim()
      while (keyTrimmed.toLowerCase().startsWith("bearer ")) {
        keyTrimmed = keyTrimmed.slice(7).trim()
      }
      if (keyTrimmed !== "••••••••" && keyTrimmed !== "........") {
        key = keyTrimmed
      }
    } else {
      options.baseURL = url().trim()
      let keyTrimmed = genericApiKey().trim()
      while (keyTrimmed.toLowerCase().startsWith("bearer ")) {
        keyTrimmed = keyTrimmed.slice(7).trim()
      }
      if (keyTrimmed !== "••••••••" && keyTrimmed !== "........") {
        key = keyTrimmed
      }
    }

    const msg: Record<string, unknown> = {
      type: "saveProviderOptions",
      requestId: rid,
      providerID: pid(),
      options,
    }
    if (key !== undefined) msg.apiKey = key

    action.send(msg as any, {
      onConnected: () => {
        setSaving(false)

        props.onDone(props.model.providerID, isBedrock() ? (bedrockModelId().trim() || mid()) : props.model.id)
      },
      onError: (m: any) => {
        setSaving(false)
        setError(m.message ?? "Failed to save credentials")
      },
    })
  }

  const btnLabel = createMemo(() => {
    if (isBedrock() && credentialsEmpty()) return "Select Model"
    return "Save & Connect"
  })

  return (
    <div class="accure-provider-config-dialog">
      <div class="accure-provider-config-title">{title()}</div>
      <form class="accure-provider-config-form" onSubmit={submit}>

        {/* ── Amazon Bedrock ─────────────────────────────────────────────── */}
        <Show when={isBedrock()}>
          <TextField
            autofocus
            type="text"
            label="Model ID"
            placeholder="e.g. nvidia.nemotron-super-3-120b"
            value={bedrockModelId()}
            onChange={setBedrockModelId}
          />
          <div class="accure-provider-config-hint">
            Leave credentials empty to apply only the Model ID (keeps existing keys).
          </div>
          <TextField
            type="password"
            label="AWS Access Key ID"
            placeholder="AKIA... (leave empty to keep existing)"
            value={accessKey()}
            onChange={setAccessKey}
          />
          <TextField
            type="password"
            label="AWS Secret Access Key"
            placeholder="Your secret access key (leave empty to keep existing)"
            value={secretKey()}
            onChange={setSecretKey}
          />
          <TextField
            type="text"
            label="Region"
            placeholder="us-east-1"
            value={region()}
            onChange={setRegion}
          />
        </Show>

        {/* ── Accure Models (ATM-3 / ATM-4 / AVM-3) ─────────────────────── */}
        <Show when={isAccureModels()}>
          <TextField
            autofocus
            type="text"
            label="Model ID"
            placeholder="atm-4"
            value={modelId()}
            onChange={setModelId}
          />
          <TextField
            type="url"
            label="AccureIQx API URL"
            placeholder="https://iq.accure.ai/api/v1"
            value={baseUrl()}
            onChange={setBaseUrl}
          />
          <div class="accure-provider-config-hint" style={{ "margin-top": "-8px", "margin-bottom": "8px" }}>
            For local Docker workspaces (App Builder), use <code>http://host.docker.internal:3000/api/v1</code>
          </div>
          <TextField
            type="password"
            label="AccureIQx User API Key"
            placeholder="ak-..."
            value={apiKey()}
            onChange={setApiKey}
          />
        </Show>

        {/* ── Generic (other unconfigured providers) ─────────────────────── */}
        <Show when={!isBedrock() && !isAccureModels()}>
          <TextField
            autofocus
            type="url"
            label="API Endpoint URL"
            placeholder="https://your-endpoint.example.com/v1"
            value={url()}
            onChange={setUrl}
          />
          <TextField
            type="password"
            label="API Key (optional)"
            placeholder="sk-..."
            value={genericApiKey()}
            onChange={setGenericApiKey}
          />
        </Show>

        <Show when={error()}>
          <div class="accure-provider-config-error">{error()}</div>
        </Show>

        <div class="accure-provider-config-actions">
          <Button variant="ghost" size="large" type="button" onClick={props.onCancel} disabled={saving()}>
            Cancel
          </Button>
          <Button variant="primary" size="large" type="submit" disabled={saving()}>
            <Show when={saving()} fallback={<span>{btnLabel()}</span>}>
              <Spinner />
            </Show>
          </Button>
        </div>
      </form>
    </div>
  )
}

export default AccureProviderConfigDialog
