/**
 * Legacy Accure CLI migration module
 *
 * Migrates authentication from the legacy Accure Code VS Code extension CLI
 * config path (~/.accurecode/cli/config.json) to the new auth.json format.
 */
import fs from "fs/promises"
import os from "os"
import path from "path"

export const LEGACY_CONFIG_PATH = path.join(os.homedir(), ".accurecode", "cli", "config.json")

interface LegacyProvider {
  id: string
  provider: string
  accurecodeToken?: string
  accurecodeModel?: string
  accurecodeOrganizationId?: string
}

interface LegacyConfig {
  providers?: LegacyProvider[]
}

interface LegacyAccureAuth {
  token: string
  organizationId?: string
}

// Auth info types matching opencode's Auth module
type ApiAuth = { type: "api"; key: string }
type OAuthAuth = { type: "oauth"; access: string; refresh: string; expires: number; accountId?: string }
type AuthInfo = ApiAuth | OAuthAuth

/**
 * Extract accure auth from legacy config
 */
function extractAccureAuth(config: LegacyConfig): LegacyAccureAuth | undefined {
  if (!config.providers) return undefined

  const provider = config.providers.find((p) => p.provider === "accurecode")
  if (!provider?.accurecodeToken) return undefined

  return {
    token: provider.accurecodeToken,
    organizationId: provider.accurecodeOrganizationId,
  }
}

/**
 * Migrate Accure authentication from legacy CLI config path.
 *
 * Checks ~/.accurecode/cli/config.json for existing accure credentials
 * and migrates them to the new auth.json format.
 *
 * @param hasAccureAuth - Callback to check if accure auth already exists
 * @param saveAccureAuth - Callback to save the migrated auth
 * @returns true if migration was performed, false otherwise
 */
export async function migrateLegacyAccureAuth(
  hasAccureAuth: () => Promise<boolean>,
  saveAccureAuth: (auth: AuthInfo) => Promise<void>,
): Promise<boolean> {
  // Skip if accure auth already configured
  if (await hasAccureAuth()) return false

  // Check if legacy config exists and parse it
  const content = await fs.readFile(LEGACY_CONFIG_PATH, "utf-8").catch(() => null)
  if (!content) return false

  let config: LegacyConfig | null = null
  try {
    config = JSON.parse(content) as LegacyConfig
  } catch {
    return false
  }

  // Extract accure auth from legacy config
  const legacy = extractAccureAuth(config)
  if (!legacy) return false

  // Migrate to new format
  // Use OAuth format if organization ID present, otherwise API format
  if (legacy.organizationId) {
    await saveAccureAuth({
      type: "oauth",
      access: legacy.token,
      refresh: "",
      expires: 0,
      accountId: legacy.organizationId,
    })
  } else {
    await saveAccureAuth({
      type: "api",
      key: legacy.token,
    })
  }

  return true
}
