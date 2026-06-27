import { Effect } from "effect"
import { AccureSessionPrompt } from "@/accurecode/session/prompt" // accurecode_change
import { Agent } from "@/agent/agent"
import { AppFileSystem } from "@opencode-ai/core/filesystem"
import { InstanceState } from "@/effect/instance-state"
import { RuntimeFlags } from "@/effect/runtime-flags"
import { PartID } from "./schema"
import { MessageV2 } from "./message-v2"
import * as Session from "./session"
import CODE_SWITCH from "./prompt/code-switch.txt" // accurecode_change

export const apply = Effect.fn("SessionReminders.apply")(function* (input: {
  messages: MessageV2.WithParts[]
  agent: Agent.Info
  session: Session.Info
}) {
  const flags = yield* RuntimeFlags.Service
  const fsys = yield* AppFileSystem.Service
  const sessions = yield* Session.Service
  const userMessage = input.messages.findLast((msg) => msg.info.role === "user")
  if (!userMessage) return input.messages

  // accurecode_change start - shared planning reminder path
  // No-op unless the active agent is plan-like.
  yield* Effect.promise(() =>
    AccureSessionPrompt.insertPlanReminders({
      agent: input.agent,
      session: input.session,
      userMessage,
      messages: input.messages,
    }),
  )
  // accurecode_change end

  if (!flags.experimentalPlanMode) {
    const wasPlan = input.messages.some((msg) => msg.info.role === "assistant" && msg.info.agent === "plan")
    if (wasPlan && input.agent.name === "code") {
      // accurecode_change - renamed from "build" to "code"
      userMessage.parts.push({
        id: PartID.ascending(),
        messageID: userMessage.info.id,
        sessionID: userMessage.info.sessionID,
        type: "text",
        text: CODE_SWITCH, // accurecode_change - renamed from BUILD_SWITCH to CODE_SWITCH
        synthetic: true,
      })
    }
    return input.messages
  }

  const assistantMessage = input.messages.findLast((msg) => msg.info.role === "assistant")
  if (input.agent.name !== "plan" && assistantMessage?.info.agent === "plan") {
    const ctx = yield* InstanceState.context
    const plan = Session.plan(input.session, ctx)
    const exists = yield* fsys.existsSafe(plan)
    const part = yield* sessions.updatePart({
      id: PartID.ascending(),
      messageID: userMessage.info.id,
      sessionID: userMessage.info.sessionID,
      type: "text",
      text: exists
        ? `${CODE_SWITCH}\n\nA plan file exists at ${plan}. You should execute on the plan defined within it` // accurecode_change - renamed from BUILD_SWITCH to CODE_SWITCH
        : CODE_SWITCH, // accurecode_change - renamed from BUILD_SWITCH to CODE_SWITCH
      synthetic: true,
    })
    userMessage.parts.push(part)
    return input.messages
  }

  // accurecode_change start - replace native Plan's separate prompt with the shared reminder above
  return input.messages
  // accurecode_change end
})

export * as SessionReminders from "./reminders"
