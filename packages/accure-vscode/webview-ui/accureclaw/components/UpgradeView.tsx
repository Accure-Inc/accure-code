// AccureClaw upgrade view — shown when instance needs upgrade for chat

import { Button } from "@accurecode/accure-ui/button"
import { Card, CardTitle, CardDescription, CardActions } from "@accurecode/accure-ui/card"
import { useClaw } from "../context/claw"
import { useAccureClawLanguage } from "../context/language"

export function UpgradeView() {
  const claw = useClaw()
  const { t } = useAccureClawLanguage()

  return (
    <div class="accureclaw-center">
      <Card class="accureclaw-card">
        <CardTitle icon={false}>{t("accureClaw.upgrade.title")}</CardTitle>
        <CardDescription>
          <p class="accureclaw-card-text">{t("accureClaw.upgrade.description1")}</p>
          <p class="accureclaw-card-text">
            {t("accureClaw.upgrade.description2.before")}
            <strong>{t("accureClaw.upgrade.description2.bold")}</strong>
            {t("accureClaw.upgrade.description2.after")}
          </p>
        </CardDescription>
        <CardActions>
          <div />
          <Button variant="primary" onClick={() => claw.openExternal("https://app.accurecode.ai/claw")}>
            {t("accureClaw.upgrade.openDashboard")}
          </Button>
        </CardActions>
      </Card>
    </div>
  )
}
