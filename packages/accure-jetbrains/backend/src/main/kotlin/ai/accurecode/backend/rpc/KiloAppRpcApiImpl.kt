@file:Suppress("UnstableApiUsage")

package ai.accurecode.backend.rpc

import ai.accurecode.backend.app.AccureAppState
import ai.accurecode.backend.app.AccureBackendAppService
import ai.accurecode.backend.telemetry.AccureBackendTelemetry
import ai.accurecode.backend.app.ConfigWarning
import ai.accurecode.backend.app.LoadError
import ai.accurecode.backend.app.LoadProgress
import ai.accurecode.backend.app.ProfileResult
import ai.accurecode.jetbrains.api.model.AgentConfig
import ai.accurecode.jetbrains.api.model.Config
import ai.accurecode.jetbrains.api.model.ConfigAgent
import ai.accurecode.jetbrains.api.model.AccureProfile200Response
import ai.accurecode.rpc.dto.AgentConfigDto
import ai.accurecode.rpc.dto.ConfigDto
import ai.accurecode.rpc.dto.ConfigPatchDto
import ai.accurecode.rpc.AccureAppRpcApi
import ai.accurecode.rpc.dto.ConfigWarningDto
import ai.accurecode.rpc.dto.DeviceAuthDto
import ai.accurecode.rpc.dto.HealthDto
import ai.accurecode.rpc.dto.AccureAppStateDto
import ai.accurecode.rpc.dto.AccureAppStatusDto
import ai.accurecode.rpc.dto.LoadErrorDto
import ai.accurecode.rpc.dto.LoadProgressDto
import ai.accurecode.rpc.dto.ModelFavoriteUpdateDto
import ai.accurecode.rpc.dto.ModelSelectionUpdateDto
import ai.accurecode.rpc.dto.ModelStateDto
import ai.accurecode.rpc.dto.ModelVariantUpdateDto
import ai.accurecode.rpc.dto.ProfileBalanceDto
import ai.accurecode.rpc.dto.ProfileDto
import ai.accurecode.rpc.dto.ProfileOrganizationDto
import ai.accurecode.rpc.dto.ProfileStatusDto
import ai.accurecode.rpc.dto.TelemetryCaptureDto
import com.intellij.openapi.components.service
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.distinctUntilChanged
import kotlinx.coroutines.flow.map

/**
 * Backend implementation of [AccureAppRpcApi].
 *
 * Delegates directly to the app-level [AccureBackendAppService] —
 * no project resolution needed since all operations are app-scoped.
 */
class AccureAppRpcApiImpl : AccureAppRpcApi {

    private val app: AccureBackendAppService get() = service()

    override suspend fun connect() = app.connect()

    override suspend fun state(): Flow<AccureAppStateDto> =
        app.appState.map(::dto).distinctUntilChanged()

    override suspend fun health(): HealthDto = app.health()

    override suspend fun retry() = app.retry()

    override suspend fun restart() = app.restart()

    override suspend fun reinstall() = app.reinstall()

    override suspend fun modelState(): ModelStateDto {
        app.requireReady()
        return app.models.state()
    }

    override suspend fun updateModelFavorite(update: ModelFavoriteUpdateDto): ModelStateDto {
        app.requireReady()
        return app.models.favorite(update)
    }

    override suspend fun updateModelSelection(update: ModelSelectionUpdateDto): ModelStateDto {
        app.requireReady()
        return app.models.selection(update)
    }

    override suspend fun clearModelSelection(agent: String): ModelStateDto {
        app.requireReady()
        return app.models.clear(agent)
    }

    override suspend fun updateModelVariant(update: ModelVariantUpdateDto): ModelStateDto {
        app.requireReady()
        return app.models.variant(update)
    }

    override suspend fun updateConfig(patch: ConfigPatchDto): AccureAppStateDto {
        app.requireReady()
        return appStateDto(app.updateConfig(patch))
    }

    override suspend fun refreshProfile(): ProfileDto? = app.refreshProfile()?.let(::profileDto)

    override suspend fun startLogin(directory: String?): DeviceAuthDto = app.startLogin(directory)

    override suspend fun completeLogin(directory: String?): ProfileDto? = app.completeLogin(directory)?.let(::profileDto)

    override suspend fun logout(): Boolean = app.logout()

    override suspend fun setOrganization(organizationId: String?): ProfileDto? =
        app.setOrganization(organizationId)?.let(::profileDto)

    override suspend fun captureTelemetry(capture: TelemetryCaptureDto) {
        service<AccureBackendTelemetry>().capture(app.http, app.port, capture.event, capture.properties)
    }

    private fun dto(state: AccureAppState): AccureAppStateDto =
        appStateDto(state)
}

internal fun appStateDto(state: AccureAppState): AccureAppStateDto =
    when (state) {
        AccureAppState.Disconnected -> AccureAppStateDto(AccureAppStatusDto.DISCONNECTED)
        AccureAppState.Connecting -> AccureAppStateDto(AccureAppStatusDto.CONNECTING)
        is AccureAppState.Loading -> AccureAppStateDto(
            status = AccureAppStatusDto.LOADING,
            progress = progress(state.progress),
        )
        is AccureAppState.MigrationRequired -> AccureAppStateDto(
            status = AccureAppStatusDto.MIGRATION_REQUIRED,
            migration = MigrationRpcMapper.toDto(state.detection),
        )
        is AccureAppState.Ready -> AccureAppStateDto(
            status = AccureAppStatusDto.READY,
            progress = LoadProgressDto(
                config = true,
                notifications = true,
                profile = if (state.data.profile != null) ProfileStatusDto.LOADED
                    else ProfileStatusDto.NOT_LOGGED_IN,
            ),
            warnings = state.data.warnings.map(::warning),
            config = config(state.data.config),
            profile = state.data.profile?.let(::profileDto),
        )
        is AccureAppState.Error -> AccureAppStateDto(
            status = AccureAppStatusDto.ERROR,
            error = state.message,
            errors = state.errors.map(::error),
        )
    }

internal fun profileDto(p: AccureProfile200Response): ProfileDto = ProfileDto(
    email = p.profile.email,
    name = p.profile.name,
    organizations = p.profile.organizations.orEmpty().map { org ->
        ProfileOrganizationDto(id = org.id, name = org.name, role = org.role)
    },
    balance = p.balance?.let { ProfileBalanceDto(balance = it.balance) },
    currentOrgId = p.currentOrgId,
)

private fun progress(p: LoadProgress) = LoadProgressDto(
    config = p.config,
    notifications = p.notifications,
    profile = when (p.profile) {
        ProfileResult.PENDING -> ProfileStatusDto.PENDING
        ProfileResult.LOADED -> ProfileStatusDto.LOADED
        ProfileResult.NOT_LOGGED_IN -> ProfileStatusDto.NOT_LOGGED_IN
    },
)

private fun error(e: LoadError) = LoadErrorDto(
    resource = e.resource,
    status = e.status,
    detail = e.detail,
)

private fun warning(w: ConfigWarning) = ConfigWarningDto(
    path = w.path,
    message = w.message,
    detail = w.detail,
)

private fun config(c: Config) = ConfigDto(
    model = c.model,
    smallModel = c.smallModel,
    subagentModel = c.subagentModel,
    subagentVariant = c.subagentVariant,
    agent = agents(c.agent),
)

private fun agents(cfg: ConfigAgent?): Map<String, AgentConfigDto> {
    if (cfg == null) return emptyMap()
    val known = listOf(
        "plan" to cfg.plan,
        "build" to cfg.build,
        "debug" to cfg.debug,
        "orchestrator" to cfg.orchestrator,
        "ask" to cfg.ask,
        "general" to cfg.general,
        "explore" to cfg.explore,
        "title" to cfg.title,
        "summary" to cfg.summary,
        "compaction" to cfg.compaction,
    ).mapNotNull { (name, item) -> item?.let { name to agent(it) } }.toMap()
    val extra = cfg.entries.associate { (name, item) -> name to agent(item) }
    return known + extra
}

private fun agent(cfg: AgentConfig) = AgentConfigDto(
    model = cfg.model,
    variant = cfg.variant,
)
