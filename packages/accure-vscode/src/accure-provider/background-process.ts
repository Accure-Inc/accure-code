import type { AccureClient } from "@accurecode/sdk/v2/client"

export async function stopSessionProcesses(
  client: AccureClient | null,
  sessionID: string,
  directory: string,
): Promise<void> {
  if (!client) return
  await client.backgroundProcess
    .stopSession({ sessionID, directory })
    .catch((err: unknown) => console.warn("[Accure New] AccureProvider: Failed to stop background processes:", err))
}
