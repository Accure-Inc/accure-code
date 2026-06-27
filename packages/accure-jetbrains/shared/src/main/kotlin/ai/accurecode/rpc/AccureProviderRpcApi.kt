@file:Suppress("UnstableApiUsage")

package ai.accurecode.rpc

import ai.accurecode.rpc.dto.CustomModelFetchDto
import ai.accurecode.rpc.dto.CustomModelFetchResultDto
import ai.accurecode.rpc.dto.CustomProviderSaveDto
import ai.accurecode.rpc.dto.ProviderActionResultDto
import ai.accurecode.rpc.dto.ProviderConnectDto
import ai.accurecode.rpc.dto.ProviderDisconnectDto
import ai.accurecode.rpc.dto.ProviderEnableDto
import ai.accurecode.rpc.dto.ProviderOAuthAuthorizeDto
import ai.accurecode.rpc.dto.ProviderOAuthCallbackDto
import ai.accurecode.rpc.dto.ProviderOAuthReadyDto
import ai.accurecode.rpc.dto.ProviderSettingsDto
import com.intellij.platform.rpc.RemoteApiProviderService
import fleet.rpc.RemoteApi
import fleet.rpc.Rpc
import fleet.rpc.remoteApiDescriptor

@Rpc
interface AccureProviderRpcApi : RemoteApi<Unit> {
    companion object {
        suspend fun getInstance(): AccureProviderRpcApi {
            return RemoteApiProviderService.resolve(remoteApiDescriptor<AccureProviderRpcApi>())
        }
    }

    suspend fun state(directory: String): ProviderSettingsDto
    suspend fun connect(input: ProviderConnectDto): ProviderActionResultDto
    suspend fun authorize(input: ProviderOAuthAuthorizeDto): ProviderOAuthReadyDto
    suspend fun callback(input: ProviderOAuthCallbackDto): ProviderActionResultDto
    suspend fun disconnect(input: ProviderDisconnectDto): ProviderActionResultDto
    suspend fun enable(input: ProviderEnableDto): ProviderActionResultDto
    suspend fun saveCustom(input: CustomProviderSaveDto): ProviderActionResultDto
    suspend fun fetchCustomModels(input: CustomModelFetchDto): CustomModelFetchResultDto
}
