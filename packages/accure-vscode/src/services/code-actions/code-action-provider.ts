import * as vscode from "vscode"

export class AccureCodeActionProvider implements vscode.CodeActionProvider {
  static readonly metadata: vscode.CodeActionProviderMetadata = {
    providedCodeActionKinds: [vscode.CodeActionKind.QuickFix, vscode.CodeActionKind.RefactorRewrite],
  }

  provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range | vscode.Selection,
    context: vscode.CodeActionContext,
  ): vscode.CodeAction[] {
    if (range.isEmpty) return []

    const actions: vscode.CodeAction[] = []

    const add = new vscode.CodeAction("Add to Accure Code", vscode.CodeActionKind.RefactorRewrite)
    add.command = { command: "accure-code.addToContext", title: "Add to Accure Code" }
    actions.push(add)

    const hasDiagnostics = context.diagnostics.length > 0

    if (hasDiagnostics) {
      const fix = new vscode.CodeAction("Fix with Accure Code", vscode.CodeActionKind.QuickFix)
      fix.command = { command: "accure-code.fixCode", title: "Fix with Accure Code" }
      fix.isPreferred = true
      actions.push(fix)
    }

    if (!hasDiagnostics) {
      const explain = new vscode.CodeAction("Explain with Accure Code", vscode.CodeActionKind.RefactorRewrite)
      explain.command = { command: "accure-code.explainCode", title: "Explain with Accure Code" }
      actions.push(explain)

      const improve = new vscode.CodeAction("Improve with Accure Code", vscode.CodeActionKind.RefactorRewrite)
      improve.command = { command: "accure-code.improveCode", title: "Improve with Accure Code" }
      actions.push(improve)
    }

    return actions
  }
}
