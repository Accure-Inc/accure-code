import { TelemetryEvent } from "./events.js"

// No-op telemetry client - PostHog integration stripped for Accure Code
export namespace Client {
  export function init() {
    // No-op
  }

  export function getClient(): any {
    return null
  }

  export function setEnabled(_value: boolean) {
    // No-op
  }

  export function isEnabled(): boolean {
    return false
  }

  export function capture(_event: TelemetryEvent, _properties?: Record<string, unknown>) {
    // No-op
  }

  export function identify(_distinctId: string, _properties?: Record<string, unknown>) {
    // No-op
  }

  export function alias(_distinctId: string, _aliasId: string) {
    // No-op
  }

  export async function shutdown(_timeoutMs?: number): Promise<void> {
    // No-op
  }
}
