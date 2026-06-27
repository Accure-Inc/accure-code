package ai.accurecode.client.ui.md

import ai.accurecode.client.session.ui.selection.SessionSelection
import ai.accurecode.client.session.ui.style.SessionEditorStyle

internal class MdViewHybrid(
    style: SessionEditorStyle = SessionEditorStyle.current(),
    selection: SessionSelection? = null,
    code: MdCodeBlockFactory = MdCodeBlockFactory.default(),
) : ai.accurecode.client.ui.md.hybrid.MdViewHybrid(style, selection, code)
