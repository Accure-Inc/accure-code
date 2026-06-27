@file:Suppress("UnstableApiUsage")

package ai.accurecode.backend.rpc

import ai.accurecode.rpc.AccureWorkspaceRpcApi
import com.intellij.platform.rpc.backend.RemoteApiProvider
import fleet.rpc.remoteApiDescriptor

internal class AccureProjectRpcApiProvider : RemoteApiProvider {
    override fun RemoteApiProvider.Sink.remoteApis() {
        remoteApi(remoteApiDescriptor<AccureWorkspaceRpcApi>()) {
            AccureWorkspaceRpcApiImpl()
        }
    }
}
