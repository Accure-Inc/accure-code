package ai.accurecode.client.session

import ai.accurecode.client.app.AccureAppService
import ai.accurecode.client.app.AccureSessionService
import ai.accurecode.client.app.AccureWorkspaceService
import ai.accurecode.client.app.Workspace
import ai.accurecode.client.testing.FakeAppRpcApi
import ai.accurecode.client.testing.FakeSessionRpcApi
import ai.accurecode.client.testing.FakeWorkspaceRpcApi
import ai.accurecode.rpc.dto.AccureAppStateDto
import ai.accurecode.rpc.dto.AccureAppStatusDto
import ai.accurecode.rpc.dto.AccureWorkspaceStateDto
import ai.accurecode.rpc.dto.AccureWorkspaceStatusDto
import ai.accurecode.rpc.dto.SessionDto
import ai.accurecode.rpc.dto.SessionTimeDto
import com.intellij.openapi.components.service
import com.intellij.testFramework.fixtures.BasePlatformTestCase
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel

@Suppress("UnstableApiUsage")
class SessionUiFactoryTest : BasePlatformTestCase() {
    private lateinit var scope: CoroutineScope
    private lateinit var workspace: Workspace
    private lateinit var workspaces: AccureWorkspaceService
    private lateinit var sessions: AccureSessionService
    private lateinit var app: AccureAppService

    override fun setUp() {
        super.setUp()
        scope = CoroutineScope(SupervisorJob())
        sessions = AccureSessionService(project, scope, FakeSessionRpcApi())
        app = AccureAppService(scope, FakeAppRpcApi().also {
            it.state.value = AccureAppStateDto(AccureAppStatusDto.READY)
        })
        workspaces = AccureWorkspaceService(scope, FakeWorkspaceRpcApi().also {
            it.state.value = AccureWorkspaceStateDto(AccureWorkspaceStatusDto.READY)
        })
        workspace = workspaces.workspace("/test")
    }

    override fun tearDown() {
        try {
            scope.cancel()
        } finally {
            super.tearDown()
        }
    }

    fun `test factory creates blank session ui`() {
        val ui = direct().create(project, workspace, FakeManager(), null)

        assertNotNull(ui)
    }

    fun `test factory wires open callback`() {
        val manager = FakeManager()
        val rpc = session("ses_1")
        val ui = SessionUi(project, workspace, sessions, app, scope, manager = manager, workspaces = workspaces)
        val controller = controller(ui)

        com.intellij.openapi.application.ApplicationManager.getApplication().invokeAndWait {
            controller.openSession(rpc)
        }

        assertEquals(listOf("ses_1"), manager.opened)
    }

    fun `test empty panel opens through SessionRef via controller`() {
        val manager = FakeManager()
        val rpc = session("ses_1")
        val ui = SessionUi(project, workspace, sessions, app, scope, manager = manager, workspaces = workspaces)
        val controller = controller(ui)
        val panel = ai.accurecode.client.session.ui.empty.EmptySessionPanel(testRootDisposable, controller, listOf(rpc))

        panel.clickRecent(0)

        // Recent click routes through SessionRef.Local path
        assertEquals(listOf("ses_1"), manager.opened)
    }

    fun `test empty panel show history routes through manager`() {
        val manager = FakeManager()
        val ui = SessionUi(project, workspace, sessions, app, scope, manager = manager, workspaces = workspaces)
        val controller = controller(ui)
        val panel = ai.accurecode.client.session.ui.empty.EmptySessionPanel(
            testRootDisposable,
            controller,
            emptyList(),
            history = { manager.showHistory() },
        )

        panel.clickShowHistory()

        assertEquals(1, manager.history)
    }

    private fun controller(ui: SessionUi): ai.accurecode.client.session.controller.SessionController {
        val field = SessionUi::class.java.getDeclaredField("controller")
        field.isAccessible = true
        return field.get(ui) as ai.accurecode.client.session.controller.SessionController
    }

    fun `test application service is available`() {
        assertNotNull(service<SessionUiFactory>())
    }

    private fun direct() = SessionUiFactory(scope)

    private fun session(id: String) = SessionDto(
        id = id,
        projectID = "prj",
        directory = "/test",
        title = "Session $id",
        version = "1",
        time = SessionTimeDto(created = 1.0, updated = 2.0),
    )

    private class FakeManager : SessionManager {
        val opened = mutableListOf<String>()
        var history = 0
        override fun newSession() {
        }

        override fun showHistory() {
            history++
        }

        override fun openSession(ref: SessionRef) {
            val id = when (ref) {
                is SessionRef.Local -> ref.id
                is SessionRef.Cloud -> ref.key
            }
            opened.add(id)
        }
    }
}
