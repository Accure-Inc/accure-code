// accurecode_change - new file
// Accure-specific overrides for the server control plane.
// Imported by ../../server/server.ts with minimal accurecode_change markers.

/** Additional CORS origin check for *.accurecode.ai */
export function corsOrigin(input: string): string | undefined {
  if (/^https:\/\/([a-z0-9-]+\.)*accure\.ai$/.test(input)) {
    return input
  }
  return undefined
}

export const DOC_TITLE = "accure"
export const DOC_DESCRIPTION = "accure api"
