import { InstallationVersion } from "@opencode-ai/core/installation/version"

export const DEFAULT_HEADERS = {
  "HTTP-Referer": "https://accurecode.ai",
  "X-Title": "Accure Code",
  "User-Agent": `Accure-Code/${InstallationVersion}`,
}
