// Accure notification types (mirrored from accure-gateway)
export interface AccurecodeNotificationAction {
  actionText: string
  actionURL: string
}

export interface AccurecodeNotification {
  id: string
  title: string
  message: string
  action?: AccurecodeNotificationAction
  showIn?: string[]
  suggestModelId?: string
}

// Profile types from accure-gateway
export interface AccurecodeBalance {
  balance: number
}

export interface ProfileData {
  profile: {
    email: string
    name?: string
    organizations?: Array<{ id: string; name: string; role: string }>
  }
  balance: AccurecodeBalance | null
  currentOrgId: string | null
}
