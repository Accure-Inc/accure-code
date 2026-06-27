import HomeFooter from "../feature-plugins/home/footer"
import HomeTips from "../feature-plugins/home/tips"
// accurecode_change start
import HomeNews from "@/accurecode/plugins/home-news"
import HomeOnboarding from "@/accurecode/plugins/home-onboarding"
import AccureAttention from "@/accurecode/plugins/attention"
import AccureHomeFooter from "@/accurecode/plugins/home-footer"
import AccureSidebarFooter from "@/accurecode/plugins/sidebar-footer"
import AccureSidebarBackgroundProcesses from "@/accurecode/plugins/sidebar-background-processes"
import AccureSidebarIndexing from "@/accurecode/plugins/sidebar-indexing"
import AccureSidebarPr from "@/accurecode/plugins/sidebar-pr"
import AccureSidebarUsage from "@/accurecode/plugins/sidebar-usage"
// accurecode_change end
import SidebarContext from "../feature-plugins/sidebar/context"
import SidebarMcp from "../feature-plugins/sidebar/mcp"
import SidebarLsp from "../feature-plugins/sidebar/lsp"
import SidebarTodo from "../feature-plugins/sidebar/todo"
import SidebarFiles from "../feature-plugins/sidebar/files"
import SidebarFooter from "../feature-plugins/sidebar/footer"
import PluginManager from "../feature-plugins/system/plugins"
import Notifications from "../feature-plugins/system/notifications"
import SessionV2Debug from "../feature-plugins/system/session-v2"
import WhichKey from "../feature-plugins/system/which-key"
import DiffViewer from "../feature-plugins/system/diff-viewer"
import type { TuiPlugin, TuiPluginModule } from "@accurecode/plugin/tui"
import type { RuntimeFlags } from "@/effect/runtime-flags"

export type InternalTuiPlugin = Omit<TuiPluginModule, "id"> & {
  id: string
  tui: TuiPlugin
  enabled?: boolean
}

export function internalTuiPlugins(flags: Pick<RuntimeFlags.Info, "experimentalEventSystem">): InternalTuiPlugin[] {
  return [
    HomeNews, // accurecode_change
    HomeOnboarding, // accurecode_change
    AccureAttention, // accurecode_change
    AccureHomeFooter, // accurecode_change
    AccureSidebarFooter, // accurecode_change
    AccureSidebarBackgroundProcesses, // accurecode_change
    AccureSidebarIndexing, // accurecode_change
    AccureSidebarPr, // accurecode_change
    AccureSidebarUsage, // accurecode_change
    HomeFooter,
    HomeTips,
    SidebarContext,
    SidebarMcp,
    SidebarLsp,
    SidebarTodo,
    SidebarFiles,
    SidebarFooter,
    Notifications,
    PluginManager,
    WhichKey,
    DiffViewer,
    ...(flags.experimentalEventSystem ? [SessionV2Debug] : []),
  ]
}
