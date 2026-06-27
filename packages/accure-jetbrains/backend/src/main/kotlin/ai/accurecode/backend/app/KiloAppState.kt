package ai.accurecode.backend.app

import ai.accurecode.jetbrains.api.model.Config
import ai.accurecode.jetbrains.api.model.AccureNotifications200ResponseInner
import ai.accurecode.jetbrains.api.model.AccureProfile200Response
import ai.accurecode.backend.migration.LegacyMigrationDetection

/**
 * Full application lifecycle state, combining CLI transport connection
 * status with data-loading progress.
 *
 * [ConnectionState] stays internal to [AccureConnectionService] for the
 * transport layer. This sealed class is what the frontend observes.
 */
sealed class AccureAppState {
    data object Disconnected : AccureAppState()
    data object Connecting : AccureAppState()
    data class Loading(val progress: LoadProgress) : AccureAppState()
    data class MigrationRequired(val detection: LegacyMigrationDetection) : AccureAppState()
    data class Ready(val data: AppData) : AccureAppState()
    data class Error(val message: String, val errors: List<LoadError> = emptyList()) : AccureAppState()
}

/**
 * Tracks which global data fetches have completed during the [AccureAppState.Loading] phase.
 */
data class LoadProgress(
    val config: Boolean = false,
    val notifications: Boolean = false,
    val profile: ProfileResult = ProfileResult.PENDING,
)

/** Outcome of the profile fetch. */
enum class ProfileResult { PENDING, LOADED, NOT_LOGGED_IN }

/**
 * Error detail for a single resource that failed to load.
 */
data class LoadError(
    val resource: String,
    val status: Int? = null,
    val detail: String? = null,
)

data class ConfigWarning(
    val path: String,
    val message: String,
    val detail: String? = null,
)

/**
 * All global data that has been successfully loaded.
 * Present only in [AccureAppState.Ready].
 */
data class AppData(
    val profile: AccureProfile200Response?,
    val config: Config,
    val notifications: List<AccureNotifications200ResponseInner>,
    val warnings: List<ConfigWarning> = emptyList(),
)
