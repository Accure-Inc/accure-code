// English runtime translations for autocomplete (accure:autocomplete.* namespace)
// Source: src/i18n/locales/en/kilocode.json → "autocomplete" section

export const dict = {
  "accure:autocomplete.statusBar.enabled": "$(accure-logo) Autocomplete",
  "accure:autocomplete.statusBar.snoozed": "snoozed",
  "accure:autocomplete.statusBar.warning": "$(warning) Autocomplete",
  "accure:autocomplete.statusBar.tooltip.basic": "Accure Code Autocomplete",
  "accure:autocomplete.statusBar.tooltip.disabled": "Accure Code Autocomplete (disabled)",
  "accure:autocomplete.statusBar.tooltip.noUsableProvider":
    "**No autocomplete model configured**\n\nTo enable autocomplete, add a profile with one of these supported providers: {{providers}}.\n\n[Open Settings]({{command}})",
  "accure:autocomplete.statusBar.tooltip.sessionTotal": "Session total cost:",
  "accure:autocomplete.statusBar.tooltip.provider": "Provider:",
  "accure:autocomplete.statusBar.tooltip.model": "Model:",
  "accure:autocomplete.statusBar.tooltip.profile": "Profile: ",
  "accure:autocomplete.statusBar.tooltip.defaultProfile": "Default",
  "accure:autocomplete.statusBar.tooltip.completionSummary":
    "Performed {{count}} completions between {{startTime}} and {{endTime}}, for a total cost of {{cost}}.",
  "accure:autocomplete.statusBar.tooltip.providerInfo": "Autocompletions provided by {{model}} via {{provider}}.",
  "accure:autocomplete.statusBar.cost.zero": "$0.00",
  "accure:autocomplete.statusBar.cost.lessThanCent": "<$0.01",
  "accure:autocomplete.toggleMessage": "Accure Code Autocomplete {{status}}",
  "accure:autocomplete.progress.title": "Accure Code",
  "accure:autocomplete.progress.analyzing": "Analyzing your code...",
  "accure:autocomplete.progress.generating": "Generating suggested edits...",
  "accure:autocomplete.progress.processing": "Processing suggested edits...",
  "accure:autocomplete.progress.showing": "Displaying suggested edits...",
  "accure:autocomplete.input.title": "Accure Code: Quick Task",
  "accure:autocomplete.input.placeholder": "e.g., 'refactor this function to be more efficient'",
  "accure:autocomplete.commands.generateSuggestions": "Accure Code: Generate Suggested Edits",
  "accure:autocomplete.commands.displaySuggestions": "Display Suggested Edits",
  "accure:autocomplete.commands.cancelSuggestions": "Cancel Suggested Edits",
  "accure:autocomplete.commands.applyCurrentSuggestion": "Apply Current Suggested Edit",
  "accure:autocomplete.commands.applyAllSuggestions": "Apply All Suggested Edits",
  "accure:autocomplete.commands.category": "Accure Code",
  "accure:autocomplete.codeAction.title": "Accure Code: Suggested Edits",
  "accure:autocomplete.chatParticipant.fullName": "Accure Code Agent",
  "accure:autocomplete.chatParticipant.name": "Agent",
  "accure:autocomplete.chatParticipant.description": "I can help you with quick tasks and suggested edits.",
  "accure:autocomplete.incompatibilityExtensionPopup.message":
    "The Accure Code Autocomplete is being blocked by a conflict with GitHub Copilot. To fix this, you must disable Copilot's inline suggestions.",
  "accure:autocomplete.incompatibilityExtensionPopup.disableCopilot": "Disable Copilot",
  "accure:autocomplete.incompatibilityExtensionPopup.disableInlineAssist": "Disable Autocomplete",
  "accure:autocomplete.creditsExhausted.message":
    "Accure Code Autocomplete has been paused because your account has no remaining credits. Add credits to resume autocomplete.",
  "accure:autocomplete.creditsExhausted.addCredits": "Add Credits",
  "accure:autocomplete.authError.message":
    "Accure Code Autocomplete has been paused due to an authentication error. Please sign in again.",
}
