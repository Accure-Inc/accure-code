package ai.accurecode.backend.dev

import ai.accurecode.log.AccureLog

object AccureDevMode {
    fun enabled(): Boolean = AccureLog.sandbox()
}
