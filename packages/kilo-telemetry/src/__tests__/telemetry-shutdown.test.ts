import { describe, test, expect } from "bun:test"
import { Telemetry } from "../telemetry.js"
import { Client } from "../client.js"

describe("Telemetry.shutdown", () => {
  test("succeeds cleanly when calling shutdown on stubbed telemetry", async () => {
    Client.init()
    await expect(Telemetry.shutdown(50)).resolves.toBeUndefined()
  })
})
