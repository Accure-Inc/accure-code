package ai.accurecode.client.session.controller

import ai.accurecode.client.session.model.SessionModelEvent
import ai.accurecode.rpc.dto.AgentDto
import ai.accurecode.rpc.dto.ConfigDto
import ai.accurecode.rpc.dto.AccureAppStateDto
import ai.accurecode.rpc.dto.AccureAppStatusDto
import ai.accurecode.rpc.dto.MessageTimeDto
import ai.accurecode.rpc.dto.MessageWithPartsDto
import ai.accurecode.rpc.dto.ModelDto
import ai.accurecode.rpc.dto.ProviderDto

class HistoryLoadingTest : SessionControllerTestBase() {

    fun `test existing session loads history on init`() {
        val m = msg("msg1", "ses_test", "user")
        val part = part("prt1", "ses_test", "msg1", "text", text = "hello")
        rpc.history.add(MessageWithPartsDto(m, listOf(part)))

        val c = controller("ses_test")
        val modelEvents = collectModelEvents(c)
        flush()

        assertModelEvents("HistoryLoaded", modelEvents)
        assertModel(
            """
            user#msg1
            text#prt1:
              hello
            """,
            c,
        )
    }

    fun `test non-empty history shows messages view`() {
        rpc.history.add(MessageWithPartsDto(msg("msg1", "ses_test", "user"), emptyList()))

        val c = controller("ses_test")
        val events = collect(c)
        flush()

        // ViewChanged progress fires immediately on controller construction (step 3 of plan).
        // ViewChanged session fires after non-empty history is loaded.
        assertControllerEvents("""
            AccountOverlayChanged hide
            AppChanged
            WorkspaceChanged
            ViewChanged progress
            ViewChanged session
        """, events)

        assertSession(
            """
            user#msg1

            [app: DISCONNECTED] [workspace: PENDING]
            """,
            c,
        )
    }

    fun `test empty explicit session history shows messages view`() {
        rpc.recent.add(session("ses_recent"))

        val c = controller("ses_test")
        val events = collect(c)
        val modelEvents = collectModelEvents(c)
        flush()

        assertTrue(rpc.recentCalls.isEmpty())
        assertModelEvents("HistoryLoaded", modelEvents)
        assertControllerEvents("""
            AccountOverlayChanged hide
            AppChanged
            WorkspaceChanged
            ViewChanged progress
            ViewChanged session
        """, events)
        assertSession(
            """
            [app: DISCONNECTED] [workspace: PENDING]
            """,
            c,
        )
    }

    fun `test loaded history derives agent from latest message`() {
        appRpc.state.value = AccureAppStateDto(AccureAppStatusDto.READY, config = ConfigDto(model = "accure/gpt-5"))
        projectRpc.state.value = workspaceReady(agents = agents(), default = "plan")
        rpc.history.add(MessageWithPartsDto(msg("msg1", "ses_test", "user").copy(agent = "plan", time = MessageTimeDto(1.0)), emptyList()))
        rpc.history.add(MessageWithPartsDto(msg("msg2", "ses_test", "assistant").copy(agent = "code", time = MessageTimeDto(2.0)), emptyList()))

        val c = controller("ses_test")
        flush()

        assertEquals("code", c.model.agent)
    }

    fun `test loaded history derives model from latest user message`() {
        appRpc.state.value = AccureAppStateDto(AccureAppStatusDto.READY, config = ConfigDto(model = "accure/gpt-5"))
        projectRpc.state.value = workspaceReady(
            agents = agents(),
            default = "plan",
            providers = listOf(
                ProviderDto(
                    id = "accure",
                    name = "Accure",
                    models = mapOf("gpt-5" to ModelDto(id = "gpt-5", name = "GPT-5")),
                ),
                ProviderDto(
                    id = "anthropic",
                    name = "Anthropic",
                    models = mapOf("claude" to ModelDto(id = "claude", name = "Claude")),
                ),
            ),
            connected = listOf("accure", "anthropic"),
            defaults = mapOf("plan" to "accure/gpt-5", "code" to "accure/gpt-5"),
        )
        rpc.history.add(MessageWithPartsDto(msg("msg1", "ses_test", "user").copy(
            agent = "code",
            providerID = "anthropic",
            modelID = "claude",
            time = MessageTimeDto(1.0),
        ), emptyList()))

        val c = controller("ses_test")
        flush()

        assertEquals("code", c.model.agent)
        assertEquals("anthropic/claude", c.model.model)
        assertFalse(c.model.modelOverride)
    }

    fun `test empty loaded history keeps workspace default agent`() {
        appRpc.state.value = AccureAppStateDto(AccureAppStatusDto.READY, config = ConfigDto(model = "accure/gpt-5"))
        projectRpc.state.value = workspaceReady(agents = agents(), default = "plan")

        val c = controller("ses_test")
        flush()

        assertEquals("plan", c.model.agent)
    }

    private fun agents() = listOf(
        AgentDto(name = "plan", displayName = "Plan", mode = "plan"),
        AgentDto(name = "code", displayName = "Code", mode = "code"),
    )
}
