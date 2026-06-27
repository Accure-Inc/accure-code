package ai.accurecode.backend.cli

import ai.accurecode.AccurePlugin
import ai.accurecode.backend.dev.AccureDevMode
import ai.accurecode.log.AccureLog
import com.intellij.openapi.application.ApplicationInfo
import com.intellij.openapi.application.PathManager
import com.intellij.openapi.util.SystemInfo
import com.intellij.util.system.CpuArch
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.coroutines.withTimeout
import java.io.BufferedReader
import java.io.File
import java.io.InputStreamReader
import java.security.SecureRandom
import java.util.UUID
import java.util.concurrent.TimeUnit

/**
 * Manages the Accure CLI binary lifecycle.
 *
 * Extracts the bundled CLI from JAR resources into IntelliJ's system directory,
 * spawns `accure serve --port 0`, and exposes the result as [State].
 *
 * Concurrency is handled by the owning [AccureBackendAppService] — all public
 * methods except [exited] are called under its mutex. [exited] is called from
 * [AccureConnectionService]'s IO dispatcher and is thread-safe via the stale-ref
 * guard and volatile [process] field.
 */
class AccureBackendCliManager(
    private val log: AccureLog = AccureLog.create(AccureBackendCliManager::class.java),
) : CliServer {

    companion object {
        private const val STARTUP_TIMEOUT_MS = 30_000L
        private const val KILL_TIMEOUT_SECONDS = 5L
        private val PORT_REGEX = Regex("""listening on http://[\w.]+:(\d+)""")
    }

    @Volatile
    private var process: Process? = null
    @Volatile
    private var closing: Process? = null
    private var hook: Thread? = null
    private var stderr: Thread? = null

    @Volatile
    override var forceExtract = false

    override fun process(): Process? = process

    override suspend fun init(): CliServer.State {
        return try {
            val path = extractCli()
            log.info("CLI binary path: ${path.absolutePath} (size=${path.length()} bytes)")
            withTimeout(STARTUP_TIMEOUT_MS) {
                spawn(path)
            }
        } catch (e: Exception) {
            log.warn("CLI startup failed", e)
            process?.let { proc ->
                log.info("Cleaning up orphaned CLI process (pid=${proc.pid()})")
                process = null
                cleanup(proc, "startup failure cleanup")
            }
            CliServer.State.Error(
                message = e.message ?: "Unknown error",
                details = e.stackTraceToString(),
            )
        }
    }

    override fun exited(proc: Process) {
        if (process != proc) return
        process = null
        uninstall()
        stderr = null
    }

    override fun stop() {
        val proc = process ?: return
        process = null
        cleanup(proc, "stop()")
    }

    private fun extractCli(): File {
        val platform = platform()
        val exe = if (SystemInfo.isWindows) "accure.exe" else "accure"
        val target = File(PathManager.getSystemPath(), "accure/bin/$exe")

        if (forceExtract) {
            log.info("Force re-extracting CLI resources under ${target.parentFile.absolutePath}")
            if (target.exists()) target.delete()
            forceExtract = false
        }

        extractResource("cli/$platform/$exe", target, executable = true)
        return target
    }

    private fun extractResource(resource: String, target: File, executable: Boolean) {
        val loader = javaClass.classLoader
        val url = loader.getResource(resource)
            ?: throw IllegalStateException("CLI resource not found in JAR resources at $resource")

        val size = url.openConnection().contentLengthLong
        if (size >= 0 && target.exists() && target.length() == size) {
            log.info("CLI resource up-to-date at ${target.absolutePath}")
            if (executable && !SystemInfo.isWindows) {
                target.setExecutable(true)
            }
            return
        }

        log.info("Extracting CLI resource to ${target.absolutePath}")
        target.parentFile.mkdirs()

        url.openStream().use { input ->
            target.outputStream().use { output ->
                input.copyTo(output)
            }
        }

        if (executable && !SystemInfo.isWindows) {
            target.setExecutable(true)
        }
    }

    // Must be called from a background thread — devStorageEnv() performs blocking I/O (mkdirs).
    internal fun buildEnv(pwd: String, base: Map<String, String> = System.getenv()): Map<String, String> =
        buildAccureCliEnv(pwd, base, log)

    private suspend fun spawn(cli: File): CliServer.State =
        withContext(Dispatchers.IO) {
            val pwd = generatePassword()

            val env = buildEnv(pwd)

            val cmd = listOf(cli.absolutePath, "serve", "--port", "0")
            val builder = ProcessBuilder(cmd)
            builder.environment().clear()
            builder.environment().putAll(env)
            builder.redirectErrorStream(false)

            log.info("Starting CLI: ${cmd.joinToString(" ")}")
            log.info("CLI env: ACCURECODE_CLIENT=jetbrains ACCURECODE_PLATFORM=jetbrains ACCURECODE_APP_NAME=accure-code")
            val proc = try {
                builder.start()
            } catch (e: Exception) {
                log.warn("CLI process failed to start: ${e.message}", e)
                throw e
            }
            log.info("CLI process started (pid=${proc.pid()})")
            process = proc
            install(proc)

            val stderr = StringBuilder()

            val err = Thread({
                runCatching {
                    BufferedReader(InputStreamReader(proc.errorStream)).use { reader ->
                        reader.lineSequence().forEach { line ->
                            log.warn("CLI stderr: $line")
                            synchronized(stderr) { stderr.appendLine(line) }
                        }
                    }
                }.onFailure { err ->
                    if (proc.isAlive && closing !== proc) log.warn("CLI stderr reader failed", err)
                }
            }, "accure-cli-stderr").apply { isDaemon = true; start() }
            this@AccureBackendCliManager.stderr = err

            BufferedReader(InputStreamReader(proc.inputStream)).use { reader ->
                for (line in reader.lineSequence()) {
                    log.info("CLI stdout: $line")
                    val match = PORT_REGEX.find(line)
                    if (match != null) {
                        val p = match.groupValues[1].toInt()
                        log.info("CLI server ready on port $p")
                        return@withContext CliServer.State.Ready(port = p, password = pwd)
                    }

                    if (!proc.isAlive) break
                }
            }

            val code = proc.waitFor()
            val details = synchronized(stderr) { stderr.toString().trim() }
            process = null
            uninstall()
            this@AccureBackendCliManager.stderr = null
            log.warn("CLI process exited with code $code before announcing a port: $details")
            CliServer.State.Error(
                message = "CLI process exited with code $code before announcing a port",
                details = details.ifEmpty { null },
            )
        }

    override fun dispose() {
        val proc = process ?: return
        process = null
        cleanup(proc, "Disposing")
    }

    private fun cleanup(proc: Process, source: String) {
        closing = proc
        try {
            uninstall()
            close(proc)
            kill(proc, source)
            val thread = stderr
            stderr = null
            if (thread != null && thread != Thread.currentThread()) {
                thread.join(TimeUnit.SECONDS.toMillis(1))
            }
        } finally {
            closing = null
        }
    }

    private fun install(proc: Process) {
        uninstall()
        val next = Thread({
            log.info("Shutdown hook — killing CLI process tree (pid ${proc.pid()})")
            kill(proc, "Shutdown hook", wait = false)
        }, "accure-cli-shutdown")
        val ok = runCatching { Runtime.getRuntime().addShutdownHook(next) }
        if (ok.isFailure) {
            log.warn("Failed to install CLI shutdown hook", ok.exceptionOrNull())
            return
        }
        hook = next
    }

    private fun uninstall() {
        val curr = hook ?: return
        hook = null
        val ok = runCatching { Runtime.getRuntime().removeShutdownHook(curr) }
        if (ok.isFailure) {
            log.info("Skipping CLI shutdown hook removal: ${ok.exceptionOrNull()?.message}")
        }
    }

    private fun kill(proc: Process, source: String, wait: Boolean = true) {
        log.info("$source — killing CLI process tree (pid ${proc.pid()})")
        children(proc).forEach { it.destroy() }
        proc.destroy()
        if (!wait) return
        if (!proc.waitFor(KILL_TIMEOUT_SECONDS, TimeUnit.SECONDS)) {
            log.warn("CLI process did not exit after SIGTERM, sending SIGKILL")
            children(proc).forEach { it.destroyForcibly() }
            proc.destroyForcibly()
        }
    }

    private fun children(proc: Process): List<ProcessHandle> =
        proc.toHandle().descendants().toList().asReversed()

    private fun close(proc: Process) {
        runCatching { proc.errorStream.close() }.onFailure { log.info("CLI stderr stream close skipped: ${it.message}") }
        runCatching { proc.inputStream.close() }.onFailure { log.info("CLI stdout stream close skipped: ${it.message}") }
        runCatching { proc.outputStream.close() }.onFailure { log.info("CLI stdin stream close skipped: ${it.message}") }
    }

    private fun platform(): String {
        val os = when {
            SystemInfo.isMac -> "darwin"
            SystemInfo.isLinux -> "linux"
            SystemInfo.isWindows -> "windows"
            else -> throw IllegalStateException("Unsupported OS: ${System.getProperty("os.name")}")
        }
        val arch = when (CpuArch.CURRENT) {
            CpuArch.ARM64 -> "arm64"
            CpuArch.X86_64 -> "x64"
            else -> throw IllegalStateException("Unsupported architecture: ${CpuArch.CURRENT}")
        }
        return "$os-$arch"
    }

    private fun generatePassword(): String {
        val bytes = ByteArray(32)
        SecureRandom().nextBytes(bytes)
        return bytes.joinToString("") { "%02x".format(it) }
    }
}

private const val DEFAULT_CONFIG = """{"permission":{"edit":"ask","bash":"ask"}}"""

// Must be called from a background thread — devStorageEnv() performs blocking I/O (mkdirs).
internal fun buildAccureCliEnv(
    pwd: String,
    base: Map<String, String> = System.getenv(),
    log: AccureLog = AccureLog.create(AccureBackendCliManager::class.java),
): Map<String, String> = buildMap {
    putAll(base)
    put("ACCURECODE_SERVER_PASSWORD", pwd)
    put("ACCURECODE_CLIENT", "jetbrains")
    put("ACCURECODE_ENABLE_QUESTION_TOOL", "true")
    put("ACCURECODE_PLATFORM", "jetbrains")
    put("ACCURECODE_APP_NAME", "accure-code")
    put("ACCURECODE_TELEMETRY_LEVEL", if (AccureDevMode.enabled()) "off" else "all")
    put("ACCURECODE_DISABLE_CLAUDE_CODE", "true")
    put("ACCURECODE_FEATURE", "jetbrains-plugin")
    putIfAbsent("ACCURECODE_CONFIG_CONTENT", DEFAULT_CONFIG)
    ideEnv(log).forEach { entry -> put(entry.key, entry.value) }
    devStorageEnv(log)?.forEach { entry -> put(entry.key, entry.value) }
}

private fun ideEnv(log: AccureLog): Map<String, String> = buildMap {
    runCatching {
        val info = ApplicationInfo.getInstance()
        val name = info.fullApplicationName
        val build = info.build.asString()
        put("ACCURECODE_EDITOR_NAME", name)
        put("ACCURECODE_EDITOR_NAME", "$name $build")
    }.onFailure { log.info("Could not read ApplicationInfo: ${it.message}") }

    runCatching {
        val version = AccurePlugin.version()
        if (version != null) put("ACCURECODE_APP_VERSION", version)
    }.onFailure { log.info("Could not read plugin version: ${it.message}") }

    runCatching {
        put("ACCURECODE_MACHINE_ID", machineId())
    }.onFailure { log.info("Could not read machine ID: ${it.message}") }
}

private fun machineId(): String {
    val file = File(PathManager.getSystemPath(), "accure/machine-id")
    if (file.exists()) return file.readText().trim()
    val id = UUID.randomUUID().toString()
    file.parentFile.mkdirs()
    file.writeText(id)
    return id
}

private fun devStorageEnv(log: AccureLog): Map<String, String>? {
    val enabled = System.getProperty("accurecode.dev.storage.isolated", "false").toBoolean()
    if (!enabled) return null
    val root = System.getProperty("accurecode.dev.worktree.root") ?: run {
        log.warn("accurecode.dev.storage.isolated=true but accurecode.dev.worktree.root is not set; skipping dev storage isolation")
        return null
    }
    val dev = File(root, ".accurecode-dev")
    val data = File(dev, "data")
    val config = File(dev, "config")
    val state = File(dev, "state")
    val cache = File(dev, "cache")
    for (dir in listOf(data, config, state, cache)) {
        if (!dir.mkdirs() && !dir.isDirectory) {
            log.warn("Failed to create dev storage dir ${dir.absolutePath}; skipping dev storage isolation")
            return null
        }
    }
    log.info("Dev storage isolation enabled under ${dev.absolutePath}")
    return mapOf(
        "XDG_DATA_HOME" to data.absolutePath,
        "XDG_CONFIG_HOME" to config.absolutePath,
        "XDG_STATE_HOME" to state.absolutePath,
        "XDG_CACHE_HOME" to cache.absolutePath,
    )
}
