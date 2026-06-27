import * as path from "path"
import * as os from "os"

/**
 * Global config dir: ~/.config/accure/ (XDG_CONFIG_HOME/accure)
 * This matches where the CLI reads global config from.
 */
function globalConfigDir(): string {
  const xdg = process.env.XDG_CONFIG_HOME || path.join(os.homedir(), ".config")
  return path.join(xdg, "accure")
}

export class MarketplacePaths {
  /** Project-scope config file: <workspace>/.accurecode/accure.json */
  configPath(scope: "project" | "global", workspace?: string): string {
    if (scope === "project") return path.join(workspace!, ".accurecode", "accure.json")
    return path.join(globalConfigDir(), "accure.json")
  }

  /** Agent install directory (where marketplace agents are written as .md files). */
  agentsDir(scope: "project" | "global", workspace?: string): string {
    if (scope === "project") return path.join(workspace!, ".accurecode", "agents")
    return path.join(globalConfigDir(), "agents")
  }

  /** Skill install directory (where the marketplace installer writes to). */
  skillsDir(scope: "project" | "global", workspace?: string): string {
    if (scope === "project") return path.join(workspace!, ".accurecode", "skills")
    return path.join(os.homedir(), ".accurecode", "skills")
  }
}
