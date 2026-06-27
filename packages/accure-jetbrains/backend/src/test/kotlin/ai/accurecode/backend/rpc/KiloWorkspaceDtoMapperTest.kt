package ai.accurecode.backend.rpc

import ai.accurecode.backend.workspace.ModelInfo
import ai.accurecode.backend.workspace.ProviderData
import ai.accurecode.backend.workspace.ProviderInfo
import kotlin.test.Test
import kotlin.test.assertTrue

class AccureWorkspaceDtoMapperTest {

    @Test
    fun `providers preserve prompt training disclosure`() {
        val model = ModelInfo(
            id = "paid",
            name = "Paid",
            attachment = false,
            reasoning = false,
            temperature = false,
            toolCall = true,
            free = false,
            status = null,
            recommendedIndex = null,
            variants = emptyList(),
            limit = null,
            mayTrainOnYourPrompts = true,
        )
        val data = ProviderData(
            providers = listOf(
                ProviderInfo(
                    id = "accure",
                    name = "Accure",
                    source = "api",
                    models = mapOf(model.id to model),
                ),
            ),
            connected = listOf("accure"),
            defaults = emptyMap(),
        )

        val result = AccureWorkspaceDtoMapper.providers(data)

        assertTrue(result.providers.single().models.getValue("paid").mayTrainOnYourPrompts)
    }
}
