package ai.accurecode.backend.cli

import ai.accurecode.backend.cli.AccureBackendHttpClients
import okhttp3.mockwebserver.MockResponse
import okhttp3.mockwebserver.MockWebServer
import java.util.Base64
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class AccureBackendHttpClientsTest {

    @Test
    fun `api client sends correct basic auth header`() {
        val pwd = "secret123"
        val server = MockWebServer()
        server.enqueue(MockResponse().setBody("ok"))
        server.start()

        val client = AccureBackendHttpClients.api(pwd)
        try {
            val request = okhttp3.Request.Builder()
                .url(server.url("/test"))
                .build()
            client.newCall(request).execute().use { response ->
                assertEquals(200, response.code)
            }

            val recorded = server.takeRequest()
            val expected = "Basic ${Base64.getEncoder().encodeToString("accure:$pwd".toByteArray())}"
            assertEquals(expected, recorded.getHeader("Authorization"))
        } finally {
            AccureBackendHttpClients.shutdown(client)
            server.shutdown()
        }
    }

    @Test
    fun `api client has no call or read timeout`() {
        val client = AccureBackendHttpClients.api("test")
        try {
            assertEquals(0, client.callTimeoutMillis)
            assertEquals(0, client.readTimeoutMillis)
        } finally {
            AccureBackendHttpClients.shutdown(client)
        }
    }

    @Test
    fun `api client has connect timeout`() {
        val client = AccureBackendHttpClients.api("test")
        try {
            assertTrue(client.connectTimeoutMillis > 0)
        } finally {
            AccureBackendHttpClients.shutdown(client)
        }
    }

    @Test
    fun `health client has short timeout`() {
        val client = AccureBackendHttpClients.health("test")
        try {
            assertEquals(3000, client.callTimeoutMillis)
            assertEquals(3000, client.connectTimeoutMillis)
        } finally {
            AccureBackendHttpClients.shutdown(client)
        }
    }

    @Test
    fun `health client sends correct basic auth header`() {
        val pwd = "healthpwd"
        val server = MockWebServer()
        server.enqueue(MockResponse().setBody("ok"))
        server.start()

        val client = AccureBackendHttpClients.health(pwd)
        try {
            val request = okhttp3.Request.Builder()
                .url(server.url("/global/health"))
                .build()
            client.newCall(request).execute().use { response ->
                assertEquals(200, response.code)
            }

            val recorded = server.takeRequest()
            val expected = "Basic ${Base64.getEncoder().encodeToString("accure:$pwd".toByteArray())}"
            assertEquals(expected, recorded.getHeader("Authorization"))
        } finally {
            AccureBackendHttpClients.shutdown(client)
            server.shutdown()
        }
    }

    @Test
    fun `shutdown evicts connection pool`() {
        val client = AccureBackendHttpClients.api("test")
        AccureBackendHttpClients.shutdown(client)
        assertEquals(0, client.connectionPool.connectionCount())
    }
}
