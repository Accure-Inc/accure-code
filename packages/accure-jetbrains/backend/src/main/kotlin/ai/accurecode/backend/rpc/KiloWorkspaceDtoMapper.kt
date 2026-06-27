package ai.accurecode.backend.rpc

import ai.accurecode.backend.app.LoadError
import ai.accurecode.backend.workspace.AgentData
import ai.accurecode.backend.workspace.AgentInfo
import ai.accurecode.backend.workspace.CommandInfo
import ai.accurecode.backend.workspace.AccureWorkspaceLoadProgress
import ai.accurecode.backend.workspace.ModelInfo
import ai.accurecode.backend.workspace.ProviderData
import ai.accurecode.backend.workspace.ProviderInfo
import ai.accurecode.backend.workspace.SkillInfo
import ai.accurecode.rpc.dto.AgentDto
import ai.accurecode.rpc.dto.AgentsDto
import ai.accurecode.rpc.dto.CommandDto
import ai.accurecode.rpc.dto.AccureWorkspaceLoadProgressDto
import ai.accurecode.rpc.dto.LoadErrorDto
import ai.accurecode.rpc.dto.ModelDto
import ai.accurecode.rpc.dto.ModelLimitDto
import ai.accurecode.rpc.dto.ProviderDto
import ai.accurecode.rpc.dto.ProvidersDto
import ai.accurecode.rpc.dto.SkillDto

internal object AccureWorkspaceDtoMapper {
    fun error(e: LoadError) = LoadErrorDto(
        resource = e.resource,
        status = e.status,
        detail = e.detail,
    )

    fun progress(p: AccureWorkspaceLoadProgress) = AccureWorkspaceLoadProgressDto(
        providers = p.providers,
        agents = p.agents,
        commands = p.commands,
        skills = p.skills,
    )

    fun providers(d: ProviderData) = ProvidersDto(
        providers = d.providers.map(::provider),
        connected = d.connected,
        defaults = d.defaults,
    )

    fun agents(d: AgentData) = AgentsDto(
        agents = d.agents.map(::agent),
        all = d.all.map(::agent),
        default = d.default,
    )

    fun command(c: CommandInfo) = CommandDto(
        name = c.name,
        description = c.description,
        source = c.source,
        hints = c.hints,
    )

    fun skill(s: SkillInfo) = SkillDto(
        name = s.name,
        description = s.description,
        location = s.location,
    )

    private fun provider(p: ProviderInfo) = ProviderDto(
        id = p.id,
        name = p.name,
        source = p.source,
        models = p.models.mapValues { (_, m) -> model(m) },
    )

    private fun model(m: ModelInfo) = ModelDto(
        id = m.id,
        name = m.name,
        attachment = m.attachment,
        reasoning = m.reasoning,
        temperature = m.temperature,
        toolCall = m.toolCall,
        free = m.free,
        byok = m.byok,
        status = m.status,
        recommendedIndex = m.recommendedIndex,
        variants = m.variants,
        limit = m.limit?.let { ModelLimitDto(it.context, it.input, it.output) },
        mayTrainOnYourPrompts = m.mayTrainOnYourPrompts,
    )

    private fun agent(a: AgentInfo) = AgentDto(
        name = a.name,
        displayName = a.displayName,
        description = a.description,
        mode = a.mode,
        native = a.native,
        hidden = a.hidden,
        color = a.color,
        deprecated = a.deprecated,
    )
}
