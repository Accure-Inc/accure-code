@file:Suppress("UnstableApiUsage")

package ai.accurecode.backend.rpc

import ai.accurecode.rpc.AccureAppRpcApi
import com.intellij.platform.rpc.backend.RemoteApiProvider
import fleet.rpc.remoteApiDescriptor

internal class AccureAppRpcApiProvider : RemoteApiProvider {
    override fun RemoteApiProvider.Sink.remoteApis() {
        remoteApi(remoteApiDescriptor<AccureAppRpcApi>()) {
            AccureAppRpcApiImpl()
        }
    }
}
