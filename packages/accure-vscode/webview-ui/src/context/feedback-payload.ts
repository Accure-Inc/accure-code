/**
 * Pure helpers for shaping the feedback telemetry payload.
 *
 * Payload rules:
 * - Non-Accure-Gateway providers: providerID, modelID, variant?, rating, previousRating? only.
 *   No session or message IDs — they can't be correlated to upstream data.
 * - Accure Gateway providers: add sessionID, messageID, parentMessageID. The
 *   gateway can join parentMessageID against its `x-accure-request` header logs.
 */

export type Rating = "up" | "down"

export interface RateInput {
  messageID: string
  sessionID: string
  parentMessageID: string
  providerID: string
  modelID: string
  variant?: string
  next: Rating | null
}

export function isAccureGateway(providerID: string): boolean {
  return providerID === "accure"
}

export function buildFeedbackProperties(input: RateInput, previousRating?: Rating): Record<string, unknown> {
  const properties: Record<string, unknown> = {
    providerID: input.providerID,
    modelID: input.modelID,
    rating: input.next ?? "cleared",
  }
  if (input.variant) properties.variant = input.variant
  if (previousRating) properties.previousRating = previousRating
  if (isAccureGateway(input.providerID)) {
    properties.sessionID = input.sessionID
    properties.messageID = input.messageID
    properties.parentMessageID = input.parentMessageID
  }
  return properties
}
