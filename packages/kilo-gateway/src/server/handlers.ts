import { fetchBalance, fetchProfile } from "../api/profile.js"
import { fetchKilocodeNotifications } from "../api/notifications.js"
import { clearModesCache } from "../api/modes.js"
import { HEADER_ORGANIZATIONID, KILO_API_BASE, KILO_CHAT_URL, KILO_EVENT_SERVICE_URL } from "../api/constants.js"
import type { KilocodeBalance, KilocodeProfile } from "../types.js"
import { buildKiloHeaders } from "../headers.js"

export type KiloAuth =
  | { type: "api"; key: string }
  | { type: "oauth"; access: string; refresh: string; expires: number; accountId?: string }
  | { type: "wellknown"; key: string; token: string }

export interface KiloProfileResult {
  profile: KilocodeProfile
  balance: KilocodeBalance | null
  currentOrgId: string | null
}

export interface ClawChatCredentials {
  token: string
  expiresAt: string
  kiloChatUrl: string
  eventServiceUrl: string
}

export interface AuthStore {
  get(provider: string): Promise<KiloAuth | undefined>
  set(provider: string, auth: Extract<KiloAuth, { type: "oauth" }>): Promise<void>
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

export function getToken(auth: KiloAuth | undefined) {
  if (auth?.type === "api") return auth.key
  if (auth?.type === "oauth") return auth.access
  return undefined
}

export function getOrganizationId(auth: KiloAuth | undefined) {
  if (auth?.type === "oauth") return auth.accountId
  return undefined
}

export async function getProfile(auth: AuthStore): Promise<KiloProfileResult> {
  const info = await auth.get("kilo")
  if (!info || info.type !== "oauth") throw new UnauthorizedError("Not authenticated with Kilo Gateway")

  const currentOrgId = info.accountId ?? null
  const [profile, balance] = await Promise.all([
    fetchProfile(info.access),
    fetchBalance(info.access, currentOrgId ?? undefined),
  ])
  return { profile, balance, currentOrgId }
}

export async function getNotifications(auth: AuthStore) {
  const info = await auth.get("kilo")
  const token = getToken(info)
  if (!token) return []

  return fetchKilocodeNotifications({
    kilocodeToken: token,
    kilocodeOrganizationId: getOrganizationId(info),
  })
}

export async function setOrganization(deps: OrganizationDeps, organizationId: string | null) {
  const info = await deps.auth.get("kilo")
  if (!info || info.type !== "oauth") throw new UnauthorizedError("Not authenticated with Kilo Gateway")

  await deps.auth.set("kilo", {
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
  throw new UnauthorizedError("KiloClaw features are disabled for Accure Code")
}

export async function getCloudSessions(token: string, input: CloudSessionsInput) {
  return { cliSessions: [], nextCursor: null }
}
