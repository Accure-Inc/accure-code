package ai.accurecode.client.vfs

import com.intellij.openapi.Disposable
import com.intellij.openapi.project.Project
import com.intellij.util.concurrency.annotations.RequiresEdt
import javax.swing.JComponent

interface AccureEditorKind : AccureVirtualFileKind {
    @RequiresEdt
    fun createContent(project: Project, file: AccureVirtualFile, parent: Disposable): JComponent

    fun preferredFocus(component: JComponent): JComponent? = null
}
