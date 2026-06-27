package ai.accurecode.client.plugin

import ai.accurecode.AccurePlugin
import ai.accurecode.client.session.ui.attachment.unregisterAttachmentEditorKind
import ai.accurecode.client.vfs.AccureEditorKindRegistry
import ai.accurecode.client.vfs.AccureVirtualFileSystem
import ai.accurecode.log.AccureLog
import com.intellij.ide.plugins.DynamicPluginListener
import com.intellij.ide.plugins.IdeaPluginDescriptor
import com.intellij.openapi.components.service
import com.intellij.openapi.fileEditor.FileEditorManager
import com.intellij.openapi.project.ProjectManager
import com.intellij.openapi.wm.ToolWindowManager
import javax.swing.SwingUtilities

class AccureFrontendDynamicPluginListener : DynamicPluginListener {
    override fun beforePluginUnload(pluginDescriptor: IdeaPluginDescriptor, isUpdate: Boolean) {
        if (pluginDescriptor.pluginId != AccurePlugin.id) return
        AccureFrontendUnloadCleanup.cleanup(isUpdate)
    }
}

object AccureFrontendUnloadCleanup {
    private val log = AccureLog.create(AccureFrontendUnloadCleanup::class.java)

    fun cleanup(isUpdate: Boolean) {
        log.info("Cleaning up Accure frontend for plugin unload (isUpdate=$isUpdate)")
        runEdt {
            ProjectManager.getInstance().openProjects.forEach { project ->
                if (project.isDisposed) return@forEach
                ToolWindowManager.getInstance(project).getToolWindow("Accure Code")
                    ?.contentManager
                    ?.removeAllContents(true)
                val editors = FileEditorManager.getInstance(project).openFiles
                    .filter { it.fileSystem === AccureVirtualFileSystem.getInstance() }
                editors.forEach { file -> FileEditorManager.getInstance(project).closeFile(file) }
            }
        }
        unregisterAttachmentEditorKind()
        service<AccureEditorKindRegistry>().clear()
        AccureVirtualFileSystem.getInstance().clear()
    }

    private fun runEdt(block: () -> Unit) {
        if (SwingUtilities.isEventDispatchThread()) {
            block()
            return
        }
        SwingUtilities.invokeAndWait(block)
    }
}
