package ai.accurecode.client

import ai.accurecode.client.app.AccureWorkspaceService
import ai.accurecode.client.app.Workspace
import ai.accurecode.client.session.SessionSidePanelManager
import ai.accurecode.client.telemetry.Telemetry
import ai.accurecode.log.AccureLog
import com.intellij.openapi.actionSystem.ActionManager
import com.intellij.openapi.components.Service
import com.intellij.openapi.components.service
import com.intellij.openapi.project.DumbAware
import com.intellij.openapi.project.Project
import com.intellij.openapi.wm.ToolWindow
import com.intellij.openapi.wm.ToolWindowFactory
import com.intellij.ui.content.ContentFactory
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

/**
 * Creates the Accure Code tool window and delegates session content management.
 *
 * Resolves the project directory through the backend (handles split-mode
 * where `project.basePath` is a synthetic frontend path) before creating
 * the workspace. The tool window shows a loading state until resolution
 * completes.
 */
class AccureToolWindowFactory : ToolWindowFactory, DumbAware {
    override fun createToolWindowContent(project: Project, toolWindow: ToolWindow) {
        project.service<AccureToolWindowSetupService>().create(toolWindow)
    }
}

private val LOG = AccureLog.create(AccureToolWindowFactory::class.java)

@Service(Service.Level.PROJECT)
internal class AccureToolWindowSetupService(
    private val project: Project,
    private val cs: CoroutineScope,
) {
    fun create(toolWindow: ToolWindow) {
        val start = System.currentTimeMillis()
        try {
            val workspaces = service<AccureWorkspaceService>()
            val hint = project.basePath ?: ""

            cs.launch {
                val dir = workspaces.resolveProjectDirectory(hint)
                val workspace = workspaces.workspace(dir)
                withContext(Dispatchers.Main) {
                    setup(project, toolWindow, workspace)
                }
                Telemetry.send("Tool Window Opened", mapOf(
                    "projectResolved" to dir.isNotBlank().toString(),
                    "durationMs" to (System.currentTimeMillis() - start).toString(),
                ))
            }
        } catch (e: Exception) {
            Telemetry.send("Tool Window Setup Failed", mapOf("stage" to "create", "errorClass" to e::class.java.name))
            LOG.error("Failed to create Accure tool window content", e)
        }
    }

    private fun setup(
        project: Project,
        toolWindow: ToolWindow,
        workspace: Workspace,
    ) {
        try {
            val manager = SessionSidePanelManager(project, workspace)
            val content = ContentFactory.getInstance().createContent(manager.component, "", false)
            content.setDisposer(manager)
            content.setPreferredFocusedComponent { manager.defaultFocusedComponent }
            toolWindow.contentManager.addContent(content)
            toolWindow.contentManager.setSelectedContent(content)
            manager.newSession()

            val actions = listOfNotNull(
                ActionManager.getInstance().getAction("Accure.NewSession"),
                ActionManager.getInstance().getAction("Accure.History"),
                ActionManager.getInstance().getAction("Accure.Settings"),
            )
            toolWindow.setTitleActions(actions)
        } catch (e: Exception) {
            Telemetry.send("Tool Window Setup Failed", mapOf("stage" to "setup", "errorClass" to e::class.java.name))
            LOG.error("Failed to set up Accure tool window content", e)
        }
    }
}
