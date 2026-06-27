import type { DesktopTheme } from "@opencode-ai/ui/theme/types"
import { DEFAULT_THEMES as UPSTREAM_THEMES } from "@opencode-ai/ui/theme/default-themes"
import accureJson from "./themes/accure.json"
import accureVscodeJson from "./themes/accure-vscode.json"

// Re-export all upstream theme constants
export {
  oc2Theme,
  tokyonightTheme,
  draculaTheme,
  monokaiTheme,
  solarizedTheme,
  nordTheme,
  catppuccinTheme,
  ayuTheme,
  oneDarkProTheme,
  shadesOfPurpleTheme,
  nightowlTheme,
  vesperTheme,
  carbonfoxTheme,
  gruvboxTheme,
  auraTheme,
} from "@opencode-ai/ui/theme/default-themes"

export const accureTheme = accureJson as DesktopTheme
export const accureVscodeTheme = accureVscodeJson as DesktopTheme

export const ACCURECODE_THEMES: Record<string, DesktopTheme> = {
  accure: accureTheme,
  "accure-vscode": accureVscodeTheme,
}

// Override DEFAULT_THEMES: Accure themes first, then upstream
export const DEFAULT_THEMES: Record<string, DesktopTheme> = {
  ...ACCURECODE_THEMES,
  ...UPSTREAM_THEMES,
}
