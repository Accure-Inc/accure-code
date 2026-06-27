package ai.accurecode.client.vfs

import com.intellij.openapi.components.Service
import java.util.concurrent.ConcurrentHashMap

@Service(Service.Level.APP)
class AccureVirtualFileKindRegistry {
    private val kinds = ConcurrentHashMap<String, AccureVirtualFileKind>()

    fun register(kind: AccureVirtualFileKind) {
        kinds[kind.id] = kind
    }

    fun unregister(id: String) {
        kinds.remove(id)
    }

    fun clear() {
        kinds.clear()
    }

    fun get(id: String): AccureVirtualFileKind? = kinds[id]
}
