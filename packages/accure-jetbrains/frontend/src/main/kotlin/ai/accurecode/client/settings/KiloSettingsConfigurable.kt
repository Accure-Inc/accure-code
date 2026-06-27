package ai.accurecode.client.settings

import ai.accurecode.client.plugin.AccureBundle
import ai.accurecode.client.settings.models.ModelsConfigurable
import ai.accurecode.client.settings.providers.ProvidersConfigurable
import ai.accurecode.client.settings.profile.UserProfileConfigurable
import ai.accurecode.client.ui.layout.Stack
import com.intellij.ide.DataManager
import com.intellij.openapi.options.SearchableConfigurable
import com.intellij.openapi.options.ex.Settings
import com.intellij.ui.components.ActionLink
import com.intellij.ui.components.JBLabel
import com.intellij.util.ui.JBUI
import javax.swing.JComponent

/**
 * Root settings entry under Settings -> Tools -> Accure Code.
 *
 * Displays a brief description and a link to the User Profile child page.
 * Child configurables are registered in XML (`accurecode.jetbrains.frontend.xml`) as
 * `applicationConfigurable` entries with the appropriate `parentId` — that is the
 * single source of truth for the settings hierarchy. This class does NOT implement
 * [com.intellij.openapi.options.SearchableConfigurable.Parent] to avoid creating a
 * second `UserProfileConfigurable` instance alongside the one registered in XML.
 *
 * The link uses [UserProfileConfigurable.ID] to navigate via [Settings.find]/[Settings.select].
 */
class AccureSettingsConfigurable : SearchableConfigurable {

    override fun getId(): String = ID

    override fun getDisplayName(): String = AccureBundle.message("settings.accurecode.displayName")

    override fun createComponent(): JComponent {
        val panel = Stack.vertical()
        panel.border = JBUI.Borders.empty(8, 0, 0, 0)

        val desc = JBLabel(AccureBundle.message("settings.accurecode.description"))
        desc.border = JBUI.Borders.emptyBottom(12)
        panel.next(desc)

        val link = ActionLink(AccureBundle.message("settings.profile.displayName")) { e ->
            val src = e.source as? JComponent ?: return@ActionLink
            val settings = Settings.KEY.getData(DataManager.getInstance().getDataContext(src)) ?: return@ActionLink
            open(settings, UserProfileConfigurable.ID)
        }
        link.border = JBUI.Borders.emptyBottom(4)
        panel.next(link)

        val models = ActionLink(AccureBundle.message("settings.models.displayName")) { e ->
            val src = e.source as? JComponent ?: return@ActionLink
            val settings = Settings.KEY.getData(DataManager.getInstance().getDataContext(src)) ?: return@ActionLink
            open(settings, ModelsConfigurable.ID)
        }
        models.border = JBUI.Borders.emptyBottom(4)
        panel.next(models)

        val providers = ActionLink(AccureBundle.message("settings.providers.displayName")) { e ->
            val src = e.source as? JComponent ?: return@ActionLink
            val settings = Settings.KEY.getData(DataManager.getInstance().getDataContext(src)) ?: return@ActionLink
            open(settings, ProvidersConfigurable.ID)
        }
        providers.border = JBUI.Borders.emptyBottom(4)
        panel.next(providers)

        return panel
    }

    override fun isModified(): Boolean = false

    override fun apply() = Unit

    internal fun open(settings: Settings, id: String = UserProfileConfigurable.ID) {
        settings.find(id)?.let { settings.select(it) }
    }

    companion object {
        const val ID = "ai.accurecode.jetbrains.settings"
    }
}
