package ai.accurecode.client.actions

import ai.accurecode.client.plugin.AccureBundle
import ai.accurecode.client.session.ui.prompt.PromptDataKeys
import com.intellij.openapi.actionSystem.ActionUpdateThread
import com.intellij.openapi.actionSystem.AnActionEvent
import com.intellij.openapi.project.DumbAwareAction

class StopSessionAction : DumbAwareAction(
    AccureBundle.message("action.Accure.StopSession.text"),
    AccureBundle.message("action.Accure.StopSession.description"),
    null,
) {
    companion object {
        const val ID = "Accure.StopSession"
    }

    override fun getActionUpdateThread(): ActionUpdateThread = ActionUpdateThread.EDT

    override fun update(e: AnActionEvent) {
        val ctx = e.getData(PromptDataKeys.SEND)
        e.presentation.isEnabled = ctx != null && ctx.isStopEnabled
    }

    override fun actionPerformed(e: AnActionEvent) {
        val ctx = e.getData(PromptDataKeys.SEND) ?: return
        if (!ctx.isStopEnabled) return
        ctx.stop()
    }
}
