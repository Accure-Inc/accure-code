package ai.accurecode.backend.workspace

import ai.accurecode.backend.app.LoadError

/**
 * Workspace data lifecycle state, combining connection readiness
 * with directory-scoped data loading progress.
 *
 * Only populated after [AccureAppState.Ready][ai.accurecode.backend.app.AccureAppState.Ready]
 * — the CLI server must be connected and global data loaded before
 * workspace data can be fetched.
 */
sealed class AccureWorkspaceState {
    data object Pending : AccureWorkspaceState()
    data class Loading(val progress: AccureWorkspaceLoadProgress) : AccureWorkspaceState()
    data class Ready(
        val providers: ProviderData,
        val agents: AgentData,
        val commands: List<CommandInfo>,
        val skills: List<SkillInfo>,
    ) : AccureWorkspaceState()
    data class Error(val message: String, val errors: List<LoadError> = emptyList()) : AccureWorkspaceState()
}

/**
 * Tracks which workspace data fetches have completed during
 * the [AccureWorkspaceState.Loading] phase.
 */
data class AccureWorkspaceLoadProgress(
    val providers: Boolean = false,
    val agents: Boolean = false,
    val commands: Boolean = false,
    val skills: Boolean = false,
)

data class ProviderData(
    val providers: List<ProviderInfo>,
    val connected: List<String>,
    val defaults: Map<String, String>,
)

data class ProviderInfo(
    val id: String,
    val name: String,
    val source: String?,
    val models: Map<String, ModelInfo>,
)

data class ModelInfo(
    val id: String,
    val name: String,
    val attachment: Boolean,
    val reasoning: Boolean,
    val temperature: Boolean,
    val toolCall: Boolean,
    val free: Boolean,
    val byok: Boolean = false,
    val status: String?,
    val recommendedIndex: Double?,
    val variants: List<String>,
    val limit: ModelLimitInfo?,
    val mayTrainOnYourPrompts: Boolean = false,
)

data class ModelLimitInfo(
    val context: Long = 0,
    val input: Long? = null,
    val output: Long = 0,
)

data class AgentData(
    val agents: List<AgentInfo>,
    val all: List<AgentInfo>,
    val default: String,
)

data class AgentInfo(
    val name: String,
    val displayName: String?,
    val description: String?,
    val mode: String,
    val native: Boolean?,
    val hidden: Boolean?,
    val color: String?,
    val deprecated: Boolean?,
)

data class CommandInfo(
    val name: String,
    val description: String?,
    val source: String?,
    val hints: List<String>,
)

data class SkillInfo(
    val name: String,
    val description: String?,
    val location: String,
)
