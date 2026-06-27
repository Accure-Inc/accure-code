package ai.accurecode.client.session.ui.prompt

import com.intellij.openapi.actionSystem.DataKey

object PromptDataKeys {
    @JvmField
    val SEND: DataKey<SendPromptContext> =
        DataKey.create("ai.accurecode.client.session.ui.prompt.SendPromptContext")
}
