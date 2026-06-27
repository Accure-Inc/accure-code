import { z } from "zod"
import { ACCURECODE_API_BASE } from "./constants.js"

/**
 * Accure notification schema
 */
export const AccurecodeNotificationSchema = z.object({
  id: z.string(),
  title: z.string(),
  message: z.string(),
  action: z
    .object({
      actionText: z.string(),
      actionURL: z.string(),
    })
    .optional(),
  showIn: z.array(z.string()).optional(),
  suggestModelId: z.string().optional(),
})

export type AccurecodeNotification = z.infer<typeof AccurecodeNotificationSchema>

const NotificationsResponseSchema = z.object({
  notifications: z.array(AccurecodeNotificationSchema),
})

const NOTIFICATIONS_TIMEOUT_MS = 5000

/**
 * Fetch notifications from Accure API
 *
 * @param options - Configuration with token and optional organization ID
 * @returns Array of notifications from the Accure API (clients filter by showIn)
 */
export async function fetchAccurecodeNotifications(options: {
  accurecodeToken?: string
  accurecodeOrganizationId?: string
}): Promise<AccurecodeNotification[]> {
  const token = options.accurecodeToken
  if (!token) return []

  const url = `${ACCURECODE_API_BASE}/api/users/notifications`

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(NOTIFICATIONS_TIMEOUT_MS),
    })

    if (!response.ok) return []

    const json = await response.json()
    const result = NotificationsResponseSchema.safeParse(json)

    if (!result.success) return []

    return result.data.notifications
  } catch {
    return []
  }
}
