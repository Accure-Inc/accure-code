package ai.accurecode.client.actions

import ai.accurecode.client.plugin.AccureBundle
import ai.accurecode.client.session.SessionManager
import ai.accurecode.client.telemetry.Telemetry
import com.intellij.icons.AllIcons
import com.intellij.openapi.actionSystem.AnAction
import com.intellij.openapi.actionSystem.AnActionEvent
import com.intellij.openapi.project.DumbAware

class HistoryAction : AnAction(
    AccureBundle.message("action.Accure.History.text"),
    AccureBundle.message("action.Accure.History.description"),
    AllIcons.Vcs.History,
), DumbAware {
    override fun actionPerformed(e: AnActionEvent) {
        Telemetry.send("History Opened", mapOf("surface" to "tool_window"))
        e.getData(SessionManager.KEY)?.showHistory()
    }

    override fun update(e: AnActionEvent) {
        e.presentation.isEnabled = e.getData(SessionManager.KEY) != null
    }
}
