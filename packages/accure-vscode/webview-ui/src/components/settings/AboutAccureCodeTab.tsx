import { Component, createSignal, onCleanup } from "solid-js"
import { Button } from "@accurecode/accure-ui/button"
import { Icon } from "@accurecode/accure-ui/icon"
import { showToast } from "@accurecode/accure-ui/toast"
import { useLanguage } from "../../context/language"
import { useVSCode } from "../../context/vscode"
import { useConfig } from "../../context/config"
import type { Config, ConnectionState, ExtensionMessage, MigrationSource } from "../../types/messages"
import { buildExport, parseImport, MAX_IMPORT_SIZE } from "./settings-io"

export interface AboutAccureCodeTabProps {
  port: number | null
  connectionState: ConnectionState
  extensionVersion?: string
  onMigrationClick?: (source: MigrationSource) => void // legacy-migration
}

const AboutAccureCodeTab: Component<AboutAccureCodeTabProps> = (props) => {
  const language = useLanguage()
  const vscode = useVSCode()
  const { updateConfig, updateGlobalConfig } = useConfig()
  const [importing, setImporting] = createSignal(false)
  const [exporting, setExporting] = createSignal(false)
  let epoch = 0

  const open = (url: string) => {
    vscode.postMessage({ type: "openExternal", url })
  }

  const importConfig = (config: Config) => {
    const enabled = config.indexing?.enabled
    if (enabled === undefined) {
      updateConfig(config)
      return
    }

    const indexing = { ...config.indexing }
    delete indexing.enabled
    const next = { ...config }
    if (Object.keys(indexing).length > 0) next.indexing = indexing
    else delete next.indexing

    updateConfig(next)
    updateGlobalConfig({ indexing: { enabled } })
  }

  // Listen for globalConfigLoaded response
  const handler = (event: MessageEvent) => {
    const msg = event.data as ExtensionMessage
    if (msg.type !== "globalConfigLoaded" || !exporting()) return
    setExporting(false)
    epoch++
    const payload = buildExport(msg.config)
    const json = JSON.stringify(payload, null, 2)
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "accure-settings.json"
    a.click()
    URL.revokeObjectURL(url)
  }
  window.addEventListener("message", handler)
  onCleanup(() => window.removeEventListener("message", handler))

  // ----- Export -----
  const handleExport = () => {
    if (exporting()) return
    setExporting(true)
    const token = ++epoch
    vscode.postMessage({ type: "requestGlobalConfig" })
    setTimeout(() => {
      if (epoch === token) setExporting(false)
    }, 5000)
  }

  // ----- Import -----
  const handleImport = () => {
    if (importing()) return
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.style.display = "none"
    input.addEventListener("change", () => {
      const file = input.files?.[0]
      if (!file) return
      if (file.size > MAX_IMPORT_SIZE) {
        showToast({ variant: "error", title: language.t("settings.aboutAccureCode.importSettings.tooLarge") })
        return
      }
      setImporting(true)
      const reader = new FileReader()
      reader.onload = () => {
        setImporting(false)
        const text = reader.result as string
        const result = parseImport(text)
        if (!result.ok) {
          const key =
            result.error === "invalidJson"
              ? "settings.aboutAccureCode.importSettings.invalidJson"
              : "settings.aboutAccureCode.importSettings.invalidConfig"
          showToast({ variant: "error", title: language.t(key) })
          return
        }
        if (result.warning === "newerVersion") {
          showToast({
            variant: "default",
            title: language.t("settings.aboutAccureCode.importSettings.newerVersion"),
          })
        }
        importConfig(result.config)
        showToast({
          variant: "success",
          title: language.t("settings.aboutAccureCode.importSettings.success"),
        })
      }
      reader.onerror = () => {
        setImporting(false)
        showToast({ variant: "error", title: language.t("settings.aboutAccureCode.importSettings.invalidJson") })
      }
      reader.readAsText(file)
    })
    document.body.appendChild(input)
    input.click()
    document.body.removeChild(input)
  }

  const getStatusColor = () => {
    switch (props.connectionState) {
      case "connected":
        return "var(--vscode-testing-iconPassed, #89d185)"
      case "connecting":
        return "var(--vscode-testing-iconQueued, #cca700)"
      case "disconnected":
        return "var(--vscode-testing-iconFailed, #f14c4c)"
      case "error":
        return "var(--vscode-testing-iconFailed, #f14c4c)"
    }
  }

  const getStatusText = () => {
    switch (props.connectionState) {
      case "connected":
        return language.t("settings.aboutAccureCode.status.connected")
      case "connecting":
        return language.t("settings.aboutAccureCode.status.connecting")
      case "disconnected":
        return language.t("settings.aboutAccureCode.status.disconnected")
      case "error":
        return language.t("settings.aboutAccureCode.status.error")
    }
  }

  const linkStyle = {
    color: "var(--vscode-textLink-foreground)",
    "text-decoration": "none",
    cursor: "pointer",
  } as const

  const sectionStyle = {
    background: "var(--vscode-editor-background)",
    border: "1px solid var(--vscode-panel-border)",
    "border-radius": "4px",
    padding: "16px",
    "margin-bottom": "16px",
  } as const

  const headingStyle = {
    "font-size": "var(--accure-font-size-13)",
    "font-weight": "600",
    "margin-bottom": "12px",
    "margin-top": "0",
    color: "var(--vscode-foreground)",
  } as const

  const labelStyle = {
    "font-size": "var(--accure-font-size-12)",
    color: "var(--vscode-descriptionForeground)",
    width: "100px",
  } as const

  const valueStyle = {
    "font-size": "var(--accure-font-size-12)",
    color: "var(--vscode-foreground)",
    "font-family": "var(--vscode-editor-font-family, monospace)",
  } as const

  return (
    <div>
      {/* Version Information */}
      <div style={sectionStyle}>
        <h4 style={headingStyle}>{language.t("settings.aboutAccureCode.versionInfo")}</h4>
        <div style={{ display: "flex", "align-items": "center" }}>
          <span style={labelStyle}>{language.t("settings.aboutAccureCode.version.label")}</span>
          <span style={valueStyle}>{props.extensionVersion ?? "—"}</span>
        </div>
      </div>

      {/* Community & Support */}
      <div style={sectionStyle}>
        <h4 style={headingStyle}>{language.t("settings.aboutAccureCode.community")}</h4>
        <p
          style={{
            "font-size": "var(--accure-font-size-12)",
            color: "var(--vscode-descriptionForeground)",
            margin: "0 0 12px 0",
            "line-height": "1.5",
          }}
        >
          {language.t("settings.aboutAccureCode.feedback.prefix")}{" "}
          <span style={linkStyle} onClick={() => open("https://github.com/Accure-Inc/accure-code")}>
            GitHub
          </span>{" "}
          {language.t("settings.aboutAccureCode.feedback.or")}{" "}
          <span style={linkStyle} onClick={() => open("https://github.com/Accure-Inc/accure-code/discussions")}>
            Discussions
          </span>
          .
        </p>
        <p
          style={{
            "font-size": "var(--accure-font-size-12)",
            color: "var(--vscode-descriptionForeground)",
            margin: 0,
            "line-height": "1.5",
          }}
        >
          {language.t("settings.aboutAccureCode.support.prefix")}{" "}
          <span style={linkStyle} onClick={() => open("https://accure.ai/support")}>
            accure.ai/support
          </span>
          .
        </p>
      </div>

      {/* Telemetry */}
      <div style={sectionStyle}>
        <h4 style={headingStyle}>{language.t("settings.aboutAccureCode.telemetry.title")}</h4>
        <p
          style={{
            "font-size": "var(--accure-font-size-12)",
            color: "var(--vscode-descriptionForeground)",
            margin: "0 0 12px 0",
            "line-height": "1.5",
          }}
        >
          {language.t("settings.aboutAccureCode.telemetry.description")}
        </p>
        <Button
          variant="secondary"
          size="small"
          onClick={() => vscode.postMessage({ type: "openVSCodeSettings", query: "telemetry.telemetryLevel" })}
        >
          <Icon name="settings-gear" />
          {language.t("settings.aboutAccureCode.telemetry.openSettings")}
        </Button>
      </div>

      {/* CLI Server */}
      <div style={sectionStyle}>
        <h4 style={headingStyle}>{language.t("settings.aboutAccureCode.cliServer")}</h4>

        {/* Connection Status */}
        <div style={{ display: "flex", "align-items": "center", "margin-bottom": "12px" }}>
          <span style={labelStyle}>{language.t("settings.aboutAccureCode.status.label")}</span>
          <div style={{ display: "flex", "align-items": "center", gap: "8px" }}>
            <span
              style={{
                width: "8px",
                height: "8px",
                "border-radius": "50%",
                background: getStatusColor(),
                display: "inline-block",
              }}
            />
            <span style={{ "font-size": "var(--accure-font-size-12)", color: "var(--vscode-foreground)" }}>
              {getStatusText()}
            </span>
          </div>
        </div>

        {/* Port Number */}
        <div style={{ display: "flex", "align-items": "center" }}>
          <span style={labelStyle}>{language.t("settings.aboutAccureCode.port.label")}</span>
          <span style={valueStyle}>{props.port !== null ? props.port : "—"}</span>
        </div>
      </div>

      {/* Settings Transfer */}
      <div style={sectionStyle}>
        <h4 style={headingStyle}>{language.t("settings.aboutAccureCode.settingsTransfer.title")}</h4>
        <p
          style={{
            "font-size": "var(--accure-font-size-12)",
            color: "var(--vscode-descriptionForeground)",
            margin: "0 0 12px 0",
            "line-height": "1.5",
          }}
        >
          {language.t("settings.aboutAccureCode.settingsTransfer.description")}
        </p>
        <div style={{ display: "flex", gap: "8px" }}>
          <Button variant="secondary" size="small" onClick={handleExport}>
            <Icon name="cloud-upload" />
            {language.t("settings.aboutAccureCode.exportSettings")}
          </Button>
          <Button variant="secondary" size="small" onClick={handleImport} disabled={importing()}>
            <Icon name="download" />
            {language.t("settings.aboutAccureCode.importSettings")}
          </Button>
        </div>
      </div>

      {/* legacy-migration start */}
      <div style={{ ...sectionStyle, "margin-bottom": "0" }}>
        <h4 style={headingStyle}>{language.t("settings.aboutAccureCode.legacyMigration.title")}</h4>
        <p
          style={{
            "font-size": "var(--accure-font-size-12)",
            color: "var(--vscode-descriptionForeground)",
            margin: "0 0 12px 0",
            "line-height": "1.5",
          }}
        >
          {language.t("settings.aboutAccureCode.legacyMigration.description")}
        </p>
        <div style={{ display: "flex", gap: "8px", "flex-wrap": "wrap" }}>
          <Button variant="secondary" size="small" onClick={() => props.onMigrationClick?.("legacy")}>
            {language.t("settings.legacyMigration.link")}
          </Button>
          <Button
            variant="secondary"
            size="small"
            onClick={() => props.onMigrationClick?.("roo")}
            title={language.t("settings.aboutAccureCode.rooImport.description")}
          >
            {language.t("settings.aboutAccureCode.rooImport.button")}
          </Button>
        </div>
      </div>
      {/* legacy-migration end */}

      {/* Reset Settings */}
      <div style={sectionStyle}>
        <h4 style={headingStyle}>{language.t("settings.aboutAccureCode.resetSettings.title")}</h4>
        <p
          style={{
            "font-size": "var(--accure-font-size-12)",
            color: "var(--vscode-descriptionForeground)",
            margin: "0 0 12px 0",
            "line-height": "1.5",
          }}
        >
          {language.t("settings.aboutAccureCode.resetSettings.description")}
        </p>
        <button
          type="button"
          onClick={() => vscode.postMessage({ type: "resetAllSettings" })}
          style={{
            background: "var(--vscode-button-background)",
            color: "var(--vscode-button-foreground)",
            border: "none",
            padding: "6px 14px",
            "border-radius": "2px",
            cursor: "pointer",
            "font-size": "var(--accure-font-size-12)",
          }}
        >
          {language.t("settings.aboutAccureCode.resetSettings.button")}
        </button>
      </div>
    </div>
  )
}

export default AboutAccureCodeTab
