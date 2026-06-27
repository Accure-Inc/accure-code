export * from "./client.js"
export * from "./server.js"

import { createAccureClient } from "./client.js"
import { createAccureServer } from "./server.js"
import type { ServerOptions } from "./server.js"

export async function createAccure(options?: ServerOptions) {
  const server = await createAccureServer({
    ...options,
  })

  const client = createAccureClient({
    baseUrl: server.url,
  })

  return {
    client,
    server,
  }
}
