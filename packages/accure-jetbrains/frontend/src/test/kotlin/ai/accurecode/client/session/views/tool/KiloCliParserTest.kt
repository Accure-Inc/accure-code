package ai.accurecode.client.session.views.tool

import ai.accurecode.cli.AccureCliParser
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNull

class AccureCliParserTest {
    @Test
    fun `tag extracts trimmed tool xml value`() {
        val text = """
            <path>
              /tmp/example.txt
            </path>
            <type>file</type>
        """.trimIndent()

        assertEquals("/tmp/example.txt", AccureCliParser.tag(text, "path"))
        assertEquals("file", AccureCliParser.tag(text, "type"))
    }

    @Test
    fun `tag returns null for blank or missing value`() {
        assertNull(AccureCliParser.tag("<path>   </path>", "path"))
        assertNull(AccureCliParser.tag("<type>file</type>", "path"))
    }
}
