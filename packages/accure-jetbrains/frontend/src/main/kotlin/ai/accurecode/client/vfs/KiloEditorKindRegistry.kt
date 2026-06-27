package ai.accurecode.client.vfs

import com.intellij.openapi.components.Service
import com.intellij.openapi.components.service
import java.util.concurrent.ConcurrentHashMap

@Service(Service.Level.APP)
class AccureEditorKindRegistry {
    private val kinds = ConcurrentHashMap<String, AccureEditorKind>()

    fun register(kind: AccureEditorKind) {
        kinds[kind.id] = kind
        service<AccureVirtualFileKindRegistry>().register(kind)
    }

    fun unregister(id: String) {
        kinds.remove(id)
        service<AccureVirtualFileKindRegistry>().unregister(id)
    }

    fun clear() {
        kinds.keys.forEach { id -> unregister(id) }
    }

    fun get(id: String): AccureEditorKind? = kinds[id]
}
