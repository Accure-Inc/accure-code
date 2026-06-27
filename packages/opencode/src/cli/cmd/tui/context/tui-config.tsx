// accurecode_change start - reactive TUI config provider enables hot reload (impl in accurecode mirror)
import { AccureTuiConfig } from "@/accurecode/cli/cmd/tui/context/tui-config"

export const useTuiConfig = AccureTuiConfig.use
export const TuiConfigProvider = AccureTuiConfig.Provider
// accurecode_change end
