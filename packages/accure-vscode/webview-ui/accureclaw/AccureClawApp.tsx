// AccureClaw root component

import { Switch, Match } from "solid-js"
import { ThemeProvider } from "@accurecode/accure-ui/theme"
import { MarkedProvider } from "@accurecode/accure-ui/context/marked"
import { Button } from "@accurecode/accure-ui/button"
import { Spinner } from "@accurecode/accure-ui/spinner"
import { Toast } from "@accurecode/accure-ui/toast"
import { ClawProvider, useClaw } from "./context/claw"
import { AccureClawLanguageProvider, useAccureClawLanguage } from "./context/language"
import { ConversationList } from "./components/ConversationList"
import { MessageArea } from "./components/MessageArea"
import { StatusSidebar } from "./components/StatusSidebar"
import { SetupView } from "./components/SetupView"
import { UpgradeView } from "./components/UpgradeView"

function Content() {
  const claw = useClaw()
  const { t } = useAccureClawLanguage()

  return (
    <div class="accureclaw-root">
      <Switch>
        <Match when={claw.phase() === "loading"}>
          <div class="accureclaw-center">
            <div class="accureclaw-loading">
              <Spinner />
              <span>{t("accureClaw.loading")}</span>
            </div>
          </div>
        </Match>
        <Match when={claw.phase() === "noInstance"}>
          <SetupView />
        </Match>
        <Match when={claw.phase() === "needsUpgrade"}>
          <UpgradeView />
        </Match>
        <Match when={claw.phase() === "error"}>
          <div class="accureclaw-center">
            <div class="accureclaw-error-view">
              <span class="accureclaw-error-text">{claw.error()}</span>
              <Button variant="primary" onClick={() => claw.retry()}>
                {t("accureClaw.error.retry")}
              </Button>
            </div>
          </div>
        </Match>
        <Match when={claw.phase() === "ready"}>
          <div class="accureclaw-layout">
            <ConversationList />
            <MessageArea />
            <StatusSidebar />
          </div>
        </Match>
      </Switch>
      <Toast.Region />
    </div>
  )
}

export function AccureClawApp() {
  return (
    <ThemeProvider defaultTheme="accure-vscode">
      <ClawProvider>
        <LanguageBridge>
          <MarkedProvider>
            <Content />
          </MarkedProvider>
        </LanguageBridge>
      </ClawProvider>
    </ThemeProvider>
  )
}

/** Bridges the claw context locale into the language provider. Must be below ClawProvider. */
function LanguageBridge(props: { children: any }) {
  const claw = useClaw()
  return <AccureClawLanguageProvider locale={claw.locale}>{props.children}</AccureClawLanguageProvider>
}
