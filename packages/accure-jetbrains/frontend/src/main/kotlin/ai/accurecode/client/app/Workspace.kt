package ai.accurecode.client.app

import ai.accurecode.rpc.dto.AccureWorkspaceStateDto
import kotlinx.coroutines.flow.StateFlow

/**
 * A workspace for a single directory. Mirrors the CLI concept of a
 * workspace — a directory with its providers, agents, commands, skills.
 *
 * Immutable reference — [state] flows internally as the workspace loads.
 * Lifecycle managed by [AccureWorkspaceService].
 */
class Workspace(
    val directory: String,
    val state: StateFlow<AccureWorkspaceStateDto>,
    val reload: () -> Unit,
)
