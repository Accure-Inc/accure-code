package ai.accurecode.client.session.ui.prompt

import ai.accurecode.client.session.ui.editor.SessionEditorTextField
import ai.accurecode.client.session.ui.selection.SessionSelection
import com.intellij.openapi.project.Project

internal class PromptEditorTextField(
    project: Project,
    ctx: SendPromptContext,
    selection: SessionSelection? = null,
) : SessionEditorTextField(project, ctx, selection)
