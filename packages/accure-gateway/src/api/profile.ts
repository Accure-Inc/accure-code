import { select } from "@clack/prompts"
import type { AccurecodeProfile, Organization, AccurecodeBalance } from "../types.js"
import { DEFAULT_MODEL } from "./constants.js"

/**
 * Fetch user profile from Accure API — Stubbed for Accure Code (Local Only)
 */
export async function fetchProfile(_token: string): Promise<AccurecodeProfile> {
  return {
    email: "offline@accure.ai",
    name: "Accure Developer",
    organizations: [],
  }
}

/**
 * Alias for compatibility with existing code
 */
export const getAccureProfile = fetchProfile

/**
 * Fetch user balance from Accure API — Stubbed for Accure Code (Local Only)
 */
export async function fetchBalance(_token: string, _organizationId?: string): Promise<AccurecodeBalance | null> {
  return { balance: 0 }
}

/**
 * Alias for compatibility with existing code
 */
export const getAccureBalance = fetchBalance

/**
 * Fetch default model for a given organization context — Stubbed for Accure Code (Local Only)
 */
export async function fetchDefaultModel(_token?: string, _organizationId?: string): Promise<string> {
  return DEFAULT_MODEL
}

/**
 * Alias for compatibility with existing code
 */
export const getAccureDefaultModel = fetchDefaultModel

/**
 * Fetch both profile and balance in parallel — Stubbed for Accure Code (Local Only)
 */
export async function fetchProfileWithBalance(token: string): Promise<{
  profile: AccurecodeProfile
  balance: AccurecodeBalance | null
}> {
  const [profile, balance] = await Promise.all([fetchProfile(token), fetchBalance(token)])
  return { profile, balance }
}

/**
 * Prompt user to select an organization or personal account — Stubbed for Accure Code (Local Only)
 */
export async function promptOrganizationSelection(organizations: Organization[]): Promise<string | undefined> {
  if (!organizations || organizations.length === 0) {
    return undefined
  }

  const choices = [
    { label: "Personal Account", value: "personal", hint: "Use your personal account" },
    ...organizations.map((org) => ({
      label: org.name,
      value: org.id,
      hint: `Organization`,
    })),
  ]

  const result = await select({
    message: "Select account",
    options: choices,
  })

  if (result === "personal") {
    return undefined
  }

  return result as string
}
