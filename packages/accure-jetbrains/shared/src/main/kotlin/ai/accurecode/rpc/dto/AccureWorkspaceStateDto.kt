package ai.accurecode.rpc.dto

import kotlinx.serialization.Serializable

@Serializable
enum class AccureWorkspaceStatusDto {
    PENDING,
    LOADING,
    READY,
    ERROR,
}

@Serializable
data class AccureWorkspaceLoadProgressDto(
    val providers: Boolean = false,
    val agents: Boolean = false,
    val commands: Boolean = false,
    val skills: Boolean = false,
)

@Serializable
data class AccureWorkspaceStateDto(
    val status: AccureWorkspaceStatusDto,
    val progress: AccureWorkspaceLoadProgressDto? = null,
    val providers: ProvidersDto? = null,
    val agents: AgentsDto? = null,
    val commands: List<CommandDto> = emptyList(),
    val skills: List<SkillDto> = emptyList(),
    val error: String? = null,
    val errors: List<LoadErrorDto> = emptyList(),
)

@Serializable
data class ModelsWorkspaceDto(
    val providers: ProvidersDto? = null,
    val agents: AgentsDto? = null,
    val errors: List<LoadErrorDto> = emptyList(),
)
