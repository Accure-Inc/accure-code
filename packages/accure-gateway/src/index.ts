// ============================================================================
// Plugin
// ============================================================================
export { AccureAuthPlugin, default } from "./plugin.js"

// ============================================================================
// Provider
// ============================================================================
export { createAccure } from "./provider.js"
export { createAccureDebug } from "./provider-debug.js"
export { accureCustomLoader } from "./loader.js"
export {
  buildAccureHeaders,
  getEditorNameHeader,
  getFeatureHeader,
  getDefaultHeaders,
  getUserAgent,
} from "./headers.js"

// ============================================================================
// Auth
// ============================================================================
export { authenticateWithDeviceAuth } from "./auth/device-auth.js"
export { authenticateWithDeviceAuthTUI } from "./auth/device-auth-tui.js"
export { getAccureUrlFromToken, isValidAccurecodeToken, getApiKey } from "./auth/token.js"
export { poll, formatTimeRemaining } from "./auth/polling.js"
export { migrateLegacyAccureAuth, LEGACY_CONFIG_PATH } from "./auth/legacy-migration.js"

// ============================================================================
// API
// ============================================================================
export {
  fetchProfile,
  fetchBalance,
  fetchProfileWithBalance,
  fetchDefaultModel,
  getAccureProfile,
  getAccureBalance,
  getAccureDefaultModel,
  promptOrganizationSelection,
} from "./api/profile.js"
export { fetchAccureModels, type AccureModelsResult } from "./api/models.js"
export {
  EMPTY_ACCURECODE_EMBEDDING_MODEL_CATALOG,
  fetchAccureEmbeddingModelCatalog,
  type AccureEmbeddingModel,
  type AccureEmbeddingModelCatalog,
  type AccureEmbeddingModelCatalogIssue,
} from "./api/embedding-models.js"
export { resolveAccureGatewayBaseUrl, resolveAccureOpenRouterBaseUrl } from "./api/url.js"
export {
  AUTOCOMPLETE_MODELS,
  DEFAULT_AUTOCOMPLETE_MODEL,
  getAutocompleteModel,
  getAutocompleteModelById,
  validAutocompleteModel,
  validAutocompleteProvider,
  type AutocompleteModelDef,
  type AutocompleteProviderID,
} from "./autocomplete.js"
export {
  fetchOrganizationModes,
  clearModesCache,
  type OrganizationMode,
  type OrganizationModeConfig,
} from "./api/modes.js"
export { fetchAccurecodeNotifications, type AccurecodeNotification } from "./api/notifications.js"
export { fetchCloudSession, fetchCloudSessionForImport, importSessionToDb } from "./cloud-sessions.js"

// ============================================================================
// Server Routes (optional - requires hono and OpenCode dependencies)
// ============================================================================
export { createAccureRoutes } from "./server/routes.js"
export {
  GatewayError,
  UnauthorizedError,
  getOrganizationId,
  getClawChatCredentials,
  getClawStatus,
  getCloudSessions,
  getNotifications,
  getProfile,
  getToken,
  setOrganization,
} from "./server/handlers.js"

// ============================================================================
// Note: TUI exports moved to separate entry point
// ============================================================================
// For TUI components and commands, import from "@accurecode/accure-gateway/tui"
// This avoids circular dependencies with opencode TUI infrastructure

// ============================================================================
// Types
// ============================================================================
export type {
  // Auth types
  DeviceAuthInitiateResponse,
  DeviceAuthPollResponse,
  Organization,
  AccurecodeProfile,
  AccurecodeBalance,
  PollOptions,
  PollResult,
  // Provider types
  AccureProvider,
  AccureProviderOptions,
  AccureMetadata,
  CustomLoaderResult,
  ProviderInfo,
  LanguageModelV3,
} from "./types.js"

// ============================================================================
// Constants
// ============================================================================
export {
  ENV_ACCURECODE_API_URL,
  DEFAULT_ACCURECODE_API_URL,
  ACCURECODE_API_BASE,
  ACCURECODE_CHAT_URL,
  ACCURECODE_EVENT_SERVICE_URL,
  ACCURECODE_OPENROUTER_BASE,
  POLL_INTERVAL_MS,
  DEFAULT_MODEL,
  DEFAULT_FREE_MODEL,
  TOKEN_EXPIRATION_MS,
  USER_AGENT_BASE,
  CONTENT_TYPE,
  DEFAULT_PROVIDER_NAME,
  ANONYMOUS_API_KEY,
  MODELS_FETCH_TIMEOUT_MS,
  HEADER_ORGANIZATIONID,
  HEADER_TASKID,
  HEADER_PARENT_TASKID,
  HEADER_PROJECTID,
  HEADER_TESTER,
  HEADER_EDITORNAME,
  HEADER_MACHINEID,
  HEADER_FEATURE,
  DEFAULT_EDITOR_NAME,
  ENV_EDITOR_NAME,
  ENV_VERSION,
  TESTER_SUPPRESS_VALUE,
  ENV_FEATURE,
  PROMPTS,
  AI_SDK_PROVIDERS,
} from "./api/constants.js"
