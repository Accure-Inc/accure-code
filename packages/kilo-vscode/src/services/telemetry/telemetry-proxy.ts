import * as vscode from "vscode"
import { TelemetryEventName, type TelemetryPropertiesProvider } from "./types"
import { buildTelemetryPayload, buildTelemetryAuthHeader } from "./telemetry-proxy-utils"

/**
 * Singleton proxy that captures telemetry events and forwards them to the CLI
 * server via POST /telemetry/capture. The CLI handles PostHog delivery.
 */
export class TelemetryProxy {
  private static singleton: TelemetryProxy | undefined

  private url: string | undefined
  private password: string | undefined
  private provider: TelemetryPropertiesProvider | undefined

  private constructor() {}

  static getInstance(): TelemetryProxy {
    return (TelemetryProxy.singleton ??= new TelemetryProxy())
  }

  static capture(event: TelemetryEventName, properties?: Record<string, unknown>) {
    console.log("[telemetry]", event, properties ?? "")
    TelemetryProxy.getInstance().capture(event, properties)
  }

  /**
   * Configure the CLI server connection. Must be called before capture() will send events.
   */
  configure(url: string, password: string) {
    this.url = url
    this.password = password
  }

  setProvider(provider: TelemetryPropertiesProvider) {
    this.provider = provider
  }

  isVSCodeTelemetryEnabled(): boolean {
    return vscode.env.isTelemetryEnabled
  }

  /**
   * Fire-and-forget capture. Stubbed to do nothing in Accure Code.
   */
  capture(event: TelemetryEventName, properties?: Record<string, unknown>) {
    // Telemetry disabled for Accure Code
  }

  /**
   * Propagate runtime telemetry consent changes. Stubbed to do nothing in Accure Code.
   */
  setEnabled(enabled: boolean) {
    // Telemetry disabled for Accure Code
  }

  /**
   * No-op — the CLI server handles PostHog shutdown.
   */
  shutdown() {}
}
