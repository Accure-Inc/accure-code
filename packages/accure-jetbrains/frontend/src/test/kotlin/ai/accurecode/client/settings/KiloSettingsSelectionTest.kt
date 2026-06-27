package ai.accurecode.client.settings

import ai.accurecode.client.settings.models.ModelsConfigurable
import ai.accurecode.client.settings.profile.UserProfileConfigurable
import com.intellij.ide.util.PropertiesComponent
import com.intellij.testFramework.fixtures.BasePlatformTestCase

class AccureSettingsSelectionTest : BasePlatformTestCase() {

    override fun tearDown() {
        try {
            PropertiesComponent.getInstance(project).unsetValue(AccureSettingsSelection.SELECTED_CONFIGURABLE_KEY)
        } finally {
            super.tearDown()
        }
    }

    fun `test falls back to profile when no last settings page exists`() {
        assertEquals(UserProfileConfigurable.ID, AccureSettingsSelection.target(project))
    }

    fun `test falls back to profile when last page is not accure`() {
        select("preferences.lookFeel")

        assertEquals(UserProfileConfigurable.ID, AccureSettingsSelection.target(project))
    }

    fun `test keeps last accure root page`() {
        select(AccureSettingsConfigurable.ID)

        assertEquals(AccureSettingsConfigurable.ID, AccureSettingsSelection.target(project))
    }

    fun `test keeps last accure child page`() {
        select(ModelsConfigurable.ID)

        assertEquals(ModelsConfigurable.ID, AccureSettingsSelection.target(project))
    }

    private fun select(id: String) {
        PropertiesComponent.getInstance(project).setValue(AccureSettingsSelection.SELECTED_CONFIGURABLE_KEY, id)
    }
}
