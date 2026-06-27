/**
 * Accure Gateway TUI Integration
 *
 * This module provides TUI-specific functionality for accure-gateway.
 * It requires OpenCode TUI dependencies to be injected at runtime.
 *
 * Import from "@accurecode/accure-gateway/tui" for TUI features.
 */

// ============================================================================
// TUI Dependency Injection
// ============================================================================
export { initializeTUIDependencies, getTUIDependencies, areTUIDependenciesInitialized } from "./tui/context.js"
export type { TUIDependencies } from "./tui/types.js"

// ============================================================================
// TUI Helpers
// ============================================================================
export { formatProfileInfo, getOrganizationOptions, getDefaultOrganizationSelection } from "./tui/helpers.js"

// ============================================================================
// NOTE: TUI Components Moved to OpenCode
// ============================================================================
// All TUI components with JSX have been moved to packages/opencode/src/accurecode/
// to ensure correct JSX transpilation with @opentui/solid.
//
// Components moved:
// - registerAccureCommands -> @/accurecode/accure-commands
// - DialogAccureTeamSelect -> @/accurecode/components/dialog-accure-team-select
// - DialogAccureOrganization -> @/accurecode/components/dialog-accure-organization
// - DialogAccureProfile -> @/accurecode/components/dialog-accure-profile
// - AccureAutoMethod -> @/accurecode/components/dialog-accure-auto-method
// - AccureNews -> @/accurecode/components/accure-news
// - NotificationBanner -> @/accurecode/components/notification-banner
// - DialogAccureNotifications -> @/accurecode/components/dialog-accure-notifications
