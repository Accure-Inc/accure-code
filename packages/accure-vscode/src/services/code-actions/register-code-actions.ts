import * as vscode from "vscode"
import type { AccureProvider } from "../../AccureProvider"
import type { AgentManagerProvider } from "../../agent-manager/AgentManagerProvider"
import { getEditorContext } from "./editor-utils"
import { createPrompt } from "./support-prompt"

export function registerCodeActions(
  context: vscode.ExtensionContext,
  provider: AccureProvider,
  agentManager?: AgentManagerProvider,
): void {
  const target = () => (agentManager?.isActive() ? agentManager : provider)
  const reveal = async () => {
    await vscode.commands.executeCommand("accure-code.SidebarProvider.focus")
    await provider.waitForReady()
  }

  context.subscriptions.push(
    vscode.commands.registerCommand("accure-code.explainCode", async () => {
      const ctx = getEditorContext()
      if (!ctx) return
      const prompt = createPrompt("EXPLAIN", {
        filePath: ctx.filePath,
        startLine: String(ctx.startLine),
        endLine: String(ctx.endLine),
        selectedText: ctx.selectedText,
        userInput: "",
      })
      await reveal()
      provider.postMessage({ type: "triggerTask", text: prompt })
    }),

    vscode.commands.registerCommand("accure-code.fixCode", async () => {
      const ctx = getEditorContext()
      if (!ctx) return
      const prompt = createPrompt("FIX", {
        filePath: ctx.filePath,
        startLine: String(ctx.startLine),
        endLine: String(ctx.endLine),
        selectedText: ctx.selectedText,
        diagnostics: ctx.diagnostics,
        userInput: "",
      })
      await reveal()
      provider.postMessage({ type: "triggerTask", text: prompt })
    }),

    vscode.commands.registerCommand("accure-code.improveCode", async () => {
      const ctx = getEditorContext()
      if (!ctx) return
      const prompt = createPrompt("IMPROVE", {
        filePath: ctx.filePath,
        startLine: String(ctx.startLine),
        endLine: String(ctx.endLine),
        selectedText: ctx.selectedText,
        userInput: "",
      })
      await reveal()
      provider.postMessage({ type: "triggerTask", text: prompt })
    }),

    vscode.commands.registerCommand("accure-code.addToContext", async () => {
      const ctx = getEditorContext()
      if (!ctx) return
      const prompt = createPrompt("ADD_TO_CONTEXT", {
        filePath: ctx.filePath,
        startLine: String(ctx.startLine),
        endLine: String(ctx.endLine),
        selectedText: ctx.selectedText,
      })
      const view = target()
      if (view === provider) {
        await reveal()
      }
      view.postMessage({ type: "appendChatBoxMessage", text: prompt })
    }),

    vscode.commands.registerCommand("accure-code.focusChatInput", async () => {
      const view = target()
      if (view === provider) {
        await reveal()
      }
      view.postMessage({ type: "action", action: "focusInput" })
    }),
  )
}
