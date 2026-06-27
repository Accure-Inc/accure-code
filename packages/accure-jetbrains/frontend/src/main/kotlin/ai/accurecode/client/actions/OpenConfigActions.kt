package ai.accurecode.client.actions

import ai.accurecode.client.AccureNotifications
import ai.accurecode.client.app.AccureWorkspaceService
import ai.accurecode.client.plugin.AccureBundle
import ai.accurecode.client.session.SessionManager
import ai.accurecode.client.telemetry.Telemetry
import ai.accurecode.rpc.dto.ConfigTargetDto
import com.intellij.openapi.actionSystem.ActionUpdateThread
import com.intellij.openapi.actionSystem.AnAction
import com.intellij.openapi.actionSystem.AnActionEvent
import com.intellij.openapi.components.service
import com.intellij.openapi.project.DumbAware

abstract class ConfigAction(
    private val open: String,
    private val create: String,
    text: String,
    description: String,
) : AnAction(text, description, null), DumbAware {
    override fun getActionUpdateThread(): ActionUpdateThread = ActionUpdateThread.BGT

    protected fun text(target: ConfigTargetDto?): String {
        val key = if (target?.exists == false) create else open
        return AccureBundle.message(key, target?.displayPath ?: "...")
    }

    protected fun failed() {
        AccureNotifications.error(AccureBundle.message("action.Accure.OpenConfig.failed"))
    }
}

class OpenLocalConfigAction : ConfigAction(
    open = "action.Accure.OpenLocalConfig.text",
    create = "action.Accure.CreateLocalConfig.text",
    text = AccureBundle.message("action.Accure.OpenLocalConfig.text", "..."),
    description = AccureBundle.message("action.Accure.OpenLocalConfig.description"),
) {
    override fun update(e: AnActionEvent) {
        val dir = directory(e)
        e.presentation.isEnabled = dir != null
        e.presentation.text = text(dir?.let { service<AccureWorkspaceService>().localConfig[it] })
    }

    override fun actionPerformed(e: AnActionEvent) {
        val dir = directory(e) ?: return
        Telemetry.send("Config Opened", mapOf("surface" to "tool_window", "scope" to "local"))
        service<AccureWorkspaceService>().openLocalConfig(dir) { ok ->
            if (!ok) failed()
        }
    }

    private fun directory(e: AnActionEvent): String? {
        return e.getData(SessionManager.WORKSPACE_KEY)?.directory ?: e.project?.basePath
    }
}

class OpenGlobalConfigAction : ConfigAction(
    open = "action.Accure.OpenGlobalConfig.text",
    create = "action.Accure.CreateGlobalConfig.text",
    text = AccureBundle.message("action.Accure.OpenGlobalConfig.text", "..."),
    description = AccureBundle.message("action.Accure.OpenGlobalConfig.description"),
) {
    override fun update(e: AnActionEvent) {
        e.presentation.text = text(service<AccureWorkspaceService>().globalConfig)
    }

    override fun actionPerformed(e: AnActionEvent) {
        Telemetry.send("Config Opened", mapOf("surface" to "tool_window", "scope" to "global"))
        service<AccureWorkspaceService>().openGlobalConfig { ok ->
            if (!ok) failed()
        }
    }
}
