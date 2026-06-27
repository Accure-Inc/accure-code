package ai.accurecode.client.vfs

import com.intellij.openapi.project.Project
import com.intellij.openapi.vfs.VirtualFile
import com.intellij.util.concurrency.annotations.RequiresEdt
import javax.swing.JComponent

class AccureFileEditor(
    private val project: Project,
    private val file: VirtualFile,
    private val accure: AccureVirtualFile,
    private val kind: AccureEditorKind,
) : AccureFileEditorBase() {
    private val ui: JComponent by lazy { kind.createContent(project, accure, this) }

    @RequiresEdt
    override fun getComponent(): JComponent = ui

    override fun getPreferredFocusedComponent(): JComponent? = kind.preferredFocus(ui)
    override fun getName(): String = kind.title(accure.path.params)
    override fun getFile(): VirtualFile = file
    override fun isValid(): Boolean = super.isValid() && accure.isValid

    override fun dispose() {
        AccureVirtualFileSystem.getInstance().release(accure.path)
        super.dispose()
    }
}
