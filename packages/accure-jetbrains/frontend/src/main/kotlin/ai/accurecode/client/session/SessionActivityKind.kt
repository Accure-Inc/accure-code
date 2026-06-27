package ai.accurecode.client.session

import ai.accurecode.client.plugin.AccureBundle
import ai.accurecode.client.ui.UiStyle
import java.awt.Color

enum class SessionActivityKind {
    RUNNING,
    LOGIN_REQUIRED,
    PERMISSION,
    PLAN,
    QUESTION,
    ;

    fun label(): String = when (this) {
        RUNNING -> AccureBundle.message("session.part.tool.running")
        LOGIN_REQUIRED -> AccureBundle.message("history.badge.loginRequired")
        PERMISSION -> AccureBundle.message("history.badge.permission")
        PLAN -> AccureBundle.message("history.badge.plan")
        QUESTION -> AccureBundle.message("history.badge.question")
    }

    fun bg(): Color = when (this) {
        RUNNING -> UiStyle.Colors.runningBadgeBg()
        LOGIN_REQUIRED, PERMISSION, PLAN, QUESTION -> UiStyle.Colors.activityBadgeBg()
    }

    fun fg(): Color = when (this) {
        RUNNING -> UiStyle.Colors.runningBadgeFg()
        LOGIN_REQUIRED, PERMISSION, PLAN, QUESTION -> UiStyle.Colors.activityBadgeFg()
    }
}
