@file:Suppress("UnstableApiUsage")

package ai.accurecode.backend.rpc

import ai.accurecode.rpc.AccureSessionRpcApi
import com.intellij.platform.rpc.backend.RemoteApiProvider
import fleet.rpc.remoteApiDescriptor

internal class AccureSessionRpcApiProvider : RemoteApiProvider {
    override fun RemoteApiProvider.Sink.remoteApis() {
        remoteApi(remoteApiDescriptor<AccureSessionRpcApi>()) {
            AccureSessionRpcApiImpl()
        }
    }
}
