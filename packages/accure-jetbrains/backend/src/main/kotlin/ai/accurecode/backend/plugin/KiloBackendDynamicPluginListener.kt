package ai.accurecode.backend.plugin

import ai.accurecode.AccurePlugin
import ai.accurecode.backend.app.AccureBackendAppService
import ai.accurecode.log.AccureLog
import com.intellij.ide.plugins.DynamicPluginListener
import com.intellij.ide.plugins.IdeaPluginDescriptor
import com.intellij.openapi.components.service
import kotlinx.coroutines.runBlocking

class AccureBackendDynamicPluginListener : DynamicPluginListener {
    private val log = AccureLog.create(AccureBackendDynamicPluginListener::class.java)

    override fun beforePluginUnload(pluginDescriptor: IdeaPluginDescriptor, isUpdate: Boolean) {
        if (pluginDescriptor.pluginId != AccurePlugin.id) return
        log.info("Shutting down Accure backend for plugin unload (isUpdate=$isUpdate)")
        runBlocking {
            service<AccureBackendAppService>().shutdownForUnload()
        }
    }
}
