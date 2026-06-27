@file:Suppress("UnstableApiUsage")

package ai.accurecode.backend.rpc

import ai.accurecode.rpc.AccureMigrationRpcApi
import com.intellij.platform.rpc.backend.RemoteApiProvider
import fleet.rpc.remoteApiDescriptor

internal class AccureMigrationRpcApiProvider : RemoteApiProvider {
    override fun RemoteApiProvider.Sink.remoteApis() {
        remoteApi(remoteApiDescriptor<AccureMigrationRpcApi>()) {
            AccureMigrationRpcApiImpl()
        }
    }
}
