package ai.accurecode.client.session

import ai.accurecode.client.app.AccureAppService
import ai.accurecode.client.app.AccureSessionService
import ai.accurecode.client.app.Workspace
import ai.accurecode.client.util.UiTimerSource
import ai.accurecode.client.util.UiTimers
import com.intellij.openapi.components.Service
import com.intellij.openapi.components.service
import com.intellij.openapi.project.Project
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Job
import kotlinx.coroutines.SupervisorJob

@Service(Service.Level.APP)
class SessionUiFactory(
    private val cs: CoroutineScope,
) {
    fun create(
        project: Project,
        workspace: Workspace,
        manager: SessionManager,
        ref: SessionRef? = null,
        timers: UiTimerSource = UiTimers,
    ): SessionUi = SessionUi(
        project = project,
        workspace = workspace,
        sessions = project.service<AccureSessionService>(),
        app = service<AccureAppService>(),
        cs = scope(),
        ref = ref,
        manager = manager,
        timers = timers,
    )

    fun scope(): CoroutineScope {
        val parent = cs.coroutineContext[Job]
        return CoroutineScope(cs.coroutineContext + SupervisorJob(parent))
    }
}
