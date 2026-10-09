import type { Message } from "../types/messages"

type Entry = { id: string; error?: Message["error"] }
type Error = NonNullable<Message["error"]>

export function errorIDs(messages: Entry[]) {
  return messages.filter((msg) => !!msg.error).map((msg) => msg.id)
}

export function visibleError(messages: Entry[], hidden: (id: string) => boolean): Error | undefined {
  const last = messages.at(-1)
  if (last && !last.error) return undefined
  return messages.find((msg) => msg.error && msg.error.name !== "MessageAbortedError" && !hidden(msg.id))?.error
}
