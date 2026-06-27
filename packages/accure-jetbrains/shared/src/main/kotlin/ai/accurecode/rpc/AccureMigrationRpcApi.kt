@file:Suppress("UnstableApiUsage")

package ai.accurecode.rpc

import ai.accurecode.rpc.dto.LegacyCleanupReportDto
import ai.accurecode.rpc.dto.LegacyCleanupTargetsDto
import ai.accurecode.rpc.dto.LegacyMigrationDetectionDto
import ai.accurecode.rpc.dto.LegacyMigrationEventDto
import ai.accurecode.rpc.dto.LegacyMigrationSelectionsDto
import ai.accurecode.rpc.dto.LegacyMigrationStatusDto
import com.intellij.platform.rpc.RemoteApiProviderService
import fleet.rpc.RemoteApi
import fleet.rpc.Rpc
import fleet.rpc.remoteApiDescriptor
import kotlinx.coroutines.flow.Flow

/**
 * App-level RPC API for legacy migration operations.
 *
 * All operations are app-scoped. The backend implementation delegates to
 * [ai.accurecode.backend.app.AccureBackendMigrationManager] using the active CLI connection.
 */
@Rpc
interface AccureMigrationRpcApi : RemoteApi<Unit> {
    companion object {
        suspend fun getInstance(): AccureMigrationRpcApi =
            RemoteApiProviderService.resolve(remoteApiDescriptor<AccureMigrationRpcApi>())
    }

    /** Return the persisted migration status, or null if not yet set. */
    suspend fun status(): LegacyMigrationStatusDto?

    /** Detect legacy data and return a summary of what can be migrated. */
    suspend fun detect(): LegacyMigrationDetectionDto

    /** Run migration for the given selections, streaming progress events. */
    suspend fun migrate(selections: LegacyMigrationSelectionsDto): Flow<LegacyMigrationEventDto>

    /** Mark migration as skipped. */
    suspend fun skip()

    /** Mark migration as completed or completed with errors. */
    suspend fun finalize(status: LegacyMigrationStatusDto)

    /** Clean up legacy data after migration. */
    suspend fun cleanup(targets: LegacyCleanupTargetsDto): LegacyCleanupReportDto
}
