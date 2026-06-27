import { createMemo, Match, Switch, type JSX } from "solid-js"
import { SplitBorder } from "@tui/component/border"
import { useTheme } from "@tui/context/theme"
import { parseAccureErrorCode, accureErrorTitle, accureErrorDescription } from "@/accurecode/accure-errors"
import type { AssistantMessage } from "@accurecode/sdk/v2"

interface AccureErrorBlockProps {
  error: NonNullable<AssistantMessage["error"]>
  fallback: JSX.Element
}

export function AccureErrorBlock(props: AccureErrorBlockProps) {
  const { theme } = useTheme()

  const accureErrorCode = createMemo(() => {
    return parseAccureErrorCode(props.error)
  })

  const title = createMemo(() => {
    const code = accureErrorCode()
    return code ? accureErrorTitle(code) : undefined
  })

  const description = createMemo(() => {
    const code = accureErrorCode()
    return code ? accureErrorDescription(code) : undefined
  })

  return (
    <Switch fallback={props.fallback}>
      <Match when={accureErrorCode()}>
        <box
          border={["left"]}
          paddingTop={1}
          paddingBottom={1}
          paddingLeft={2}
          marginTop={1}
          backgroundColor={theme.backgroundPanel}
          customBorderChars={SplitBorder.customBorderChars}
          borderColor={theme.primary}
        >
          <text fg={theme.text}>{title()}</text>
          <text fg={theme.textMuted}>{description()}</text>
          <text fg={theme.primary}>{"Run /connect or `accure auth login` to connect to Accure Gateway"}</text>
        </box>
      </Match>
    </Switch>
  )
}
