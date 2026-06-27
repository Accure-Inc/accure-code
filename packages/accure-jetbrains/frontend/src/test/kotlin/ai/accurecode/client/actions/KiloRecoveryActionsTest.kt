package ai.accurecode.client.actions

import ai.accurecode.client.app.AccureWorkspaceService
import ai.accurecode.client.app.Workspace
import ai.accurecode.client.session.SessionManager
import ai.accurecode.client.testing.FakeWorkspaceRpcApi
import ai.accurecode.rpc.dto.ConfigTargetDto
import ai.accurecode.rpc.dto.AccureWorkspaceStateDto
import ai.accurecode.rpc.dto.AccureWorkspaceStatusDto
import com.intellij.openapi.actionSystem.CommonDataKeys
import com.intellij.openapi.actionSystem.AnAction
import com.intellij.openapi.actionSystem.AnActionEvent
import com.intellij.openapi.actionSystem.DataContext
import com.intellij.openapi.actionSystem.Presentation
import com.intellij.openapi.actionSystem.ex.ActionUtil
import com.intellij.openapi.application.ApplicationManager
import com.intellij.testFramework.replaceService
import com.intellij.testFramework.fixtures.BasePlatformTestCase
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.flow.MutableStateFlow

@Suppress("UnstableApiUsage")
class AccureRecoveryActionsTest : BasePlatformTestCase() {
    private lateinit var scope: CoroutineScope
    private lateinit var rpc: FakeWorkspaceRpcApi

    override fun setUp() {
        super.setUp()
        scope = CoroutineScope(SupervisorJob())
        rpc = FakeWorkspaceRpcApi()
        ApplicationManager.getApplication().replaceService(
            AccureWorkspaceService::class.java,
            AccureWorkspaceService(scope, rpc),
            testRootDisposable,
        )
    }

    override fun tearDown() {
        try {
            scope.cancel()
        } finally {
            super.tearDown()
        }
    }

    fun `test restart action stays enabled for all app states`() {
        val action = RestartAccureAction()
        val event = event(action)

        update(action, event)

        assertTrue("Restart should force-enable recovery action", event.presentation.isEnabled)
    }

    fun `test reinstall action stays enabled for all app states`() {
        val action = ReinstallAccureAction()
        val event = event(action)

        update(action, event)

        assertTrue("Reinstall should force-enable recovery action", event.presentation.isEnabled)
    }

    fun `test cli group has visible menu text`() {
        val xml = requireNotNull(javaClass.classLoader.getResourceAsStream("accurecode.jetbrains.frontend.xml"))
            .bufferedReader()
            .use { it.readText() }

        assertTrue(xml.contains("<group id=\"Accure.CliGroup\" text=\"CLI\" popup=\"true\">"))
        assertTrue(xml.contains("<reference ref=\"Accure.Restart\"/>"))
        assertTrue(xml.contains("<reference ref=\"Accure.Reinstall\"/>"))
        assertTrue(xml.contains("<group id=\"Accure.OpenConfigGroup\" text=\"Config Files\" popup=\"true\">"))
        assertTrue(xml.contains("<reference ref=\"Accure.OpenConfigGroup\"/>"))
        assertFalse(xml.contains("<action id=\"Accure.ShowProfile\""))
        assertFalse(xml.contains("<reference ref=\"Accure.ShowProfile\"/>"))
    }

    fun `test local config action says open when target exists`() {
        rpc.localConfigPath = "/test/.accurecode/accure.jsonc"
        rpc.localConfigDisplayPath = "~/.accurecode/accure.jsonc"
        rpc.localConfigExists = true
        service().localConfig["/test"] = ConfigTargetDto("/test/.accurecode/accure.jsonc", "~/.accurecode/accure.jsonc", true)
        val action = OpenLocalConfigAction()
        val event = event(action, workspace = workspace("/test"))

        update(action, event)

        assertTrue(event.presentation.isEnabled)
        assertEquals("Open: local ~/.accurecode/accure.jsonc", event.presentation.text)
        assertEquals(0, rpc.localConfigPathCalls)
    }

    fun `test local config action says create when target is missing`() {
        rpc.localConfigPath = "/test/.accurecode/accure.jsonc"
        rpc.localConfigDisplayPath = "~/.accurecode/accure.jsonc"
        rpc.localConfigExists = false
        service().localConfig["/test"] = ConfigTargetDto("/test/.accurecode/accure.jsonc", "~/.accurecode/accure.jsonc", false)
        val action = OpenLocalConfigAction()
        val event = event(action, workspace = workspace("/test"))

        update(action, event)

        assertTrue(event.presentation.isEnabled)
        assertEquals("Create: local ~/.accurecode/accure.jsonc", event.presentation.text)
        assertEquals(0, rpc.localConfigPathCalls)
    }

    fun `test global config action says open when target exists`() {
        rpc.globalConfigPath = "/config/accure.jsonc"
        rpc.globalConfigDisplayPath = "~/.config/accure/accure.jsonc"
        rpc.globalConfigExists = true
        cacheGlobal(ConfigTargetDto("/config/accure.jsonc", "~/.config/accure/accure.jsonc", true))
        val action = OpenGlobalConfigAction()
        val event = event(action)

        update(action, event)

        assertEquals("Open: global ~/.config/accure/accure.jsonc", event.presentation.text)
        assertEquals(0, rpc.globalConfigPathCalls)
    }

    fun `test global config action says create when target is missing`() {
        rpc.globalConfigPath = "/config/accure.jsonc"
        rpc.globalConfigDisplayPath = "~/.config/accure/accure.jsonc"
        rpc.globalConfigExists = false
        cacheGlobal(ConfigTargetDto("/config/accure.jsonc", "~/.config/accure/accure.jsonc", false))
        val action = OpenGlobalConfigAction()
        val event = event(action)

        update(action, event)

        assertEquals("Create: global ~/.config/accure/accure.jsonc", event.presentation.text)
        assertEquals(0, rpc.globalConfigPathCalls)
    }

    fun `test local config action disables without directory`() {
        val action = OpenLocalConfigAction()
        val event = event(action)

        update(action, event)

        assertFalse(event.presentation.isEnabled)
        assertEquals(0, rpc.localConfigPathCalls)
    }

    private fun event(action: AnAction, workspace: Workspace? = null): AnActionEvent {
        val presentation = Presentation().apply { copyFrom(action.templatePresentation) }
        presentation.isEnabled = false
        return AnActionEvent.createFromDataContext("", presentation, context(workspace))
    }

    private fun update(action: AnAction, event: AnActionEvent) {
        ApplicationManager.getApplication().executeOnPooledThread {
            ActionUtil.updateAction(action, event)
        }.get()
    }

    private fun service(): AccureWorkspaceService = ApplicationManager.getApplication().getService(AccureWorkspaceService::class.java)

    private fun cacheGlobal(target: ConfigTargetDto) {
        val field = AccureWorkspaceService::class.java.getDeclaredField("globalConfig")
        field.isAccessible = true
        field.set(service(), target)
    }

    private fun context(workspace: Workspace?): DataContext {
        return DataContext { id ->
            when (id) {
                SessionManager.WORKSPACE_KEY.name -> workspace
                CommonDataKeys.PROJECT.name -> project.takeIf { workspace != null }
                else -> null
            }
        }
    }

    private fun workspace(dir: String): Workspace {
        return Workspace(
            dir,
            MutableStateFlow(AccureWorkspaceStateDto(AccureWorkspaceStatusDto.READY)),
            reload = {},
        )
    }
}
