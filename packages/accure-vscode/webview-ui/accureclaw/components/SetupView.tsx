// AccureClaw setup view — shown when no instance is provisioned

import { Button } from "@accurecode/accure-ui/button"
import { Card, CardTitle, CardDescription, CardActions } from "@accurecode/accure-ui/card"
import { useClaw } from "../context/claw"
import { useAccureClawLanguage } from "../context/language"

export function SetupView() {
  const claw = useClaw()
  const { t } = useAccureClawLanguage()

  return (
    <div class="accureclaw-center">
      <Card class="accureclaw-card">
        <CardTitle icon={false}>{t("accureClaw.setup.title")}</CardTitle>
        <CardDescription>
          <h3 class="accureclaw-card-subtitle">{t("accureClaw.setup.subtitle")}</h3>
          <p class="accureclaw-card-text">{t("accureClaw.setup.description1")}</p>
          <p class="accureclaw-card-text">{t("accureClaw.setup.description2")}</p>
        </CardDescription>
        <CardActions>
          <Button variant="ghost" onClick={() => claw.openExternal("https://accure.ai/accureclaw")}>
            {t("accureClaw.setup.learnMore")}
          </Button>
          <Button variant="primary" onClick={() => claw.openExternal("https://app.accurecode.ai/claw")}>
            {t("accureClaw.setup.tryAccureClaw")}
          </Button>
        </CardActions>
      </Card>
    </div>
  )
}
