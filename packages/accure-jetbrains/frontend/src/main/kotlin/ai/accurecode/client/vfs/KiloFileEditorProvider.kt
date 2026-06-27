package ai.accurecode.client.vfs

import ai.accurecode.client.session.ui.attachment.ensureAttachmentEditorKind
import com.intellij.openapi.components.service
import com.intellij.openapi.fileEditor.FileEditor
import com.intellij.openapi.fileEditor.FileEditorPolicy
import com.intellij.openapi.fileEditor.FileEditorProvider
import com.intellij.openapi.project.DumbAware
import com.intellij.openapi.project.Project
import com.intellij.openapi.util.Disposer
import com.intellij.openapi.vfs.VirtualFile

class AccureFileEditorProvider : FileEditorProvider, DumbAware {
    override fun accept(project: Project, file: VirtualFile): Boolean {
        ensureAttachmentEditorKind()
        val path = path(file) ?: return false
        return service<AccureEditorKindRegistry>().get(path.kind) != null
    }

    override fun acceptRequiresReadAction(): Boolean = false

    override fun createEditor(project: Project, file: VirtualFile): FileEditor {
        ensureAttachmentEditorKind()
        val path = path(file) ?: error("Invalid Accure virtual file: ${file.path}")
        val accure = file as? AccureVirtualFile ?: AccureVirtualFile(path)
        val kind = service<AccureEditorKindRegistry>().get(accure.path.kind) ?: error("Unknown Accure editor kind: ${accure.path.kind}")
        return AccureFileEditor(project, file, accure, kind)
    }

    override fun disposeEditor(editor: FileEditor) {
        Disposer.dispose(editor)
    }

    override fun getEditorTypeId(): String = EDITOR_TYPE_ID
    override fun getPolicy(): FileEditorPolicy = FileEditorPolicy.HIDE_OTHER_EDITORS

    companion object {
        const val EDITOR_TYPE_ID = "AccureVfsEditor"

        private fun path(file: VirtualFile): AccurePath? {
            if (file is AccureVirtualFile) return file.path
            if (file.fileSystem.protocol != AccureVirtualFileSystem.PROTOCOL && !file.url.startsWith("${AccureVirtualFileSystem.PROTOCOL}://")) return null
            return AccureVirtualFileSystem.decode(file.path) ?: AccureVirtualFileSystem.decode(file.url)
        }
    }
}
