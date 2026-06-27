import { fetchBalance, fetchProfile } from "../api/profile.js"
import { fetchAccurecodeNotifications } from "../api/notifications.js"
import { clearModesCache } from "../api/modes.js"
import {
  HEADER_ORGANIZATIONID,
  ACCURECODE_API_BASE,
  ACCURECODE_CHAT_URL,
  ACCURECODE_EVENT_SERVICE_URL,
} from "../api/constants.js"
import type { AccurecodeBalance, AccurecodeProfile } from "../types.js"
import { buildAccureHeaders } from "../headers.js"

export type AccureAuth =
  | { type: "api"; key: string }
  | { type: "oauth"; access: string; refresh: string; expires: number; accountId?: string }
  | { type: "wellknown"; key: string; token: string }

export interface AccureProfileResult {
  profile: AccurecodeProfile
  balance: AccurecodeBalance | null
  currentOrgId: string | null
}

export interface ClawChatCredentials {
  token: string
  expiresAt: string
  accureChatUrl: string
  eventServiceUrl: string
}

export interface AuthStore {
  get(provider: string): Promise<AccureAuth | undefined>
  set(provider: string, auth: Extract<AccureAuth, { type: "oauth" }>): Promise<void>
}

export interface OrganizationDeps {
  auth: AuthStore
  clear(): void | Promise<void>
  dispose(): Promise<void>
}

export interface CloudSessionsInput {
  cursor?: string
  limit?: number
  gitUrl?: string
}

export class UnauthorizedError extends Error {}

export class GatewayError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message)
  }
}

export function getToken(auth: AccureAuth | undefined) {
  if (auth?.type === "api") return auth.key
  if (auth?.type === "oauth") return auth.access
  return undefined
}

export function getOrganizationId(auth: AccureAuth | undefined) {
  if (auth?.type === "oauth") return auth.accountId
  return undefined
}

export async function getProfile(auth: AuthStore): Promise<AccureProfileResult> {
  const info = await auth.get("accure")
  if (!info || info.type !== "oauth") throw new UnauthorizedError("Not authenticated with Accure Gateway")

  const currentOrgId = info.accountId ?? null
  const [profile, balance] = await Promise.all([
    fetchProfile(info.access),
    fetchBalance(info.access, currentOrgId ?? undefined),
  ])
  return { profile, balance, currentOrgId }
}

export async function getNotifications(auth: AuthStore) {
  const info = await auth.get("accure")
  const token = getToken(info)
  if (!token) return []

  return fetchAccurecodeNotifications({
    accurecodeToken: token,
    accurecodeOrganizationId: getOrganizationId(info),
  })
}

export async function setOrganization(deps: OrganizationDeps, organizationId: string | null) {
  const info = await deps.auth.get("accure")
  if (!info || info.type !== "oauth") throw new UnauthorizedError("Not authenticated with Accure Gateway")

  await deps.auth.set("accure", {
    type: "oauth",
    refresh: info.refresh,
    access: info.access,
    expires: info.expires,
    ...(organizationId && { accountId: organizationId }),
  })

  await deps.clear()
  clearModesCache()
  await deps.dispose()
  return true
}

export async function getClawStatus(auth: AuthStore) {
  return { status: null }
}

export async function getClawChatCredentials(auth: AuthStore): Promise<ClawChatCredentials> {
  throw new UnauthorizedError("AccureClaw features are disabled for Accure Code")
}

export async function getCloudSessions(token: string, input: CloudSessionsInput) {
  return { cliSessions: [], nextCursor: null }
}
