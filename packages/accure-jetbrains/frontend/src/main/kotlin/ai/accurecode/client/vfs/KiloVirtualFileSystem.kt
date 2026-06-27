package ai.accurecode.client.vfs

import com.intellij.openapi.components.service
import com.intellij.openapi.diagnostic.logger
import com.intellij.openapi.vfs.NonPhysicalFileSystem
import com.intellij.openapi.vfs.VirtualFile
import com.intellij.openapi.vfs.VirtualFileListener
import com.intellij.openapi.vfs.VirtualFilePathWrapper
import com.intellij.openapi.vfs.VirtualFileSystem
import java.net.URLDecoder
import java.nio.charset.StandardCharsets
import java.util.concurrent.ConcurrentHashMap
import kotlinx.serialization.json.Json

class AccureVirtualFileSystem : VirtualFileSystem(), NonPhysicalFileSystem {
    private val files = ConcurrentHashMap<AccurePath, AccureVirtualFile>()

    fun getPath(path: AccurePath): String = json.encodeToString(AccurePath.serializer(), path.canonical())

    fun findOrCreateFile(path: AccurePath): VirtualFile? {
        service<AccureVirtualFileKindRegistry>().get(path.kind) ?: return null
        return files.computeIfAbsent(path.canonical()) { AccureVirtualFile(it) }
    }

    fun release(path: AccurePath) {
        files.remove(path.canonical())
    }

    fun clear() {
        files.clear()
    }

    override fun findFileByPath(path: String): VirtualFile? {
        val parsed = decode(path) ?: return null
        return findOrCreateFile(parsed)
    }

    override fun refreshAndFindFileByPath(path: String): VirtualFile? = findFileByPath(path)

    override fun extractPresentableUrl(path: String): String {
        return (refreshAndFindFileByPath(path) as? VirtualFilePathWrapper)?.presentablePath ?: path
    }

    override fun refresh(asynchronous: Boolean) {}

    override fun getProtocol(): String = PROTOCOL

    override fun addVirtualFileListener(listener: VirtualFileListener) {}

    override fun removeVirtualFileListener(listener: VirtualFileListener) {}
    override fun isReadOnly(): Boolean = true
    override fun deleteFile(requestor: Any?, file: VirtualFile) = unsupported()
    override fun moveFile(requestor: Any?, file: VirtualFile, newParent: VirtualFile) = unsupported()
    override fun renameFile(requestor: Any?, file: VirtualFile, newName: String) = unsupported()
    override fun createChildFile(requestor: Any?, file: VirtualFile, name: String): VirtualFile = unsupported()
    override fun createChildDirectory(requestor: Any?, file: VirtualFile, name: String): VirtualFile = unsupported()
    override fun copyFile(requestor: Any?, file: VirtualFile, newParent: VirtualFile, copyName: String): VirtualFile = unsupported()

    private fun unsupported(): Nothing = throw UnsupportedOperationException("Accure virtual files are read-only")

    companion object {
        const val PROTOCOL = "accure"

        private val json = Json
        private val log = logger<AccureVirtualFileSystem>()
        private val local = AccureVirtualFileSystem()

        fun getInstance(): AccureVirtualFileSystem = local

        fun decode(path: String): AccurePath? {
            return try {
                val raw = raw(path) ?: return null
                json.decodeFromString(AccurePath.serializer(), raw).canonical()
            } catch (err: Exception) {
                log.warn("Cannot deserialize $path", err)
                null
            }
        }

        private fun raw(path: String): String? {
            if (path.startsWith("{")) return path
            if (!path.startsWith("$PROTOCOL://")) return null
            val raw = path.substringAfter("://")
            if (raw.startsWith("{")) return raw
            if (!raw.startsWith("%7B", ignoreCase = true)) return null
            return URLDecoder.decode(raw, StandardCharsets.UTF_8)
        }
    }
}
