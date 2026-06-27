/**
 * Accure Gateway Configuration Constants
 * Centralized configuration for all API endpoints, headers, and settings
 */

/** Environment variable for custom Accure API URL */
export const ENV_ACCURECODE_API_URL = "ACCURECODE_API_URL"

/** Default Accure API URL */
export const DEFAULT_ACCURECODE_API_URL = "https://api.accurecode.ai"

/** Base URL for Accure API - can be overridden by ACCURECODE_API_URL env var */
export const ACCURECODE_API_BASE = process.env[ENV_ACCURECODE_API_URL] || DEFAULT_ACCURECODE_API_URL

/** Environment variable for custom Accure Chat URL */
export const ACCURECODE_CHAT_URL_ENV = "ACCURECODE_CHAT_URL"

/** Default Accure Chat URL (REST endpoint for messages, conversations, etc.) */
export const ACCURECODE_DEFAULT_CHAT_URL = "https://chat.accureapps.io"

/** Base URL for Accure Chat - can be overridden by ACCURECODE_CHAT_URL env var */
export const ACCURECODE_CHAT_URL = process.env[ACCURECODE_CHAT_URL_ENV] || ACCURECODE_DEFAULT_CHAT_URL

/** Environment variable for custom Event Service URL */
export const ACCURECODE_EVENT_SERVICE_URL_ENV = "EVENT_SERVICE_URL"

/** Default Event Service URL (WebSocket endpoint for accure-chat events) */
export const ACCURECODE_DEFAULT_EVENT_SERVICE_URL = "wss://events.accureapps.io"

/** Base URL for Event Service - can be overridden by EVENT_SERVICE_URL env var */
export const ACCURECODE_EVENT_SERVICE_URL =
  process.env[ACCURECODE_EVENT_SERVICE_URL_ENV] || ACCURECODE_DEFAULT_EVENT_SERVICE_URL

/** Default base URL for OpenRouter-compatible endpoint */
export const ACCURECODE_OPENROUTER_BASE = `${ACCURECODE_API_BASE}/api/openrouter`

/** Device auth polling interval in milliseconds */
export const POLL_INTERVAL_MS = 3000

/** Default model for authenticated users */
export const DEFAULT_MODEL = "accure-auto/free"

/** Default model for anonymous/free usage */
export const DEFAULT_FREE_MODEL = "accure-auto/free"

/** Token expiration duration in milliseconds (1 year) */
export const TOKEN_EXPIRATION_MS = 365 * 24 * 60 * 60 * 1000

/** User-Agent header base value for requests */
export const USER_AGENT_BASE = "opencode-accure-provider"

/** Content-Type header value for requests */
export const CONTENT_TYPE = "application/json"

/** Default provider name */
export const DEFAULT_PROVIDER_NAME = "accure"

/** Default API key for anonymous requests */
export const ANONYMOUS_API_KEY = "anonymous"

/** Fetch timeout for model requests in milliseconds (10 seconds) */
export const MODELS_FETCH_TIMEOUT_MS = 10 * 1000

/**
 * Header constants for AccureCode API requests
 */
export const HEADER_ORGANIZATIONID = "X-ACCURECODE-ORGANIZATIONID"
export const HEADER_TASKID = "X-ACCURECODE-TASKID"
export const HEADER_PARENT_TASKID = "X-ACCURECODE-PARENT-TASKID"
export const HEADER_PROJECTID = "X-ACCURECODE-PROJECTID"
export const HEADER_TESTER = "X-ACCURECODE-TESTER"
export const HEADER_EDITORNAME = "X-ACCURECODE-EDITORNAME"
export const HEADER_MACHINEID = "X-ACCURECODE-MACHINEID"

/** Default editor name value */
export const DEFAULT_EDITOR_NAME = "Accure CLI"

/** Environment variable name for custom editor name */
export const ENV_EDITOR_NAME = "ACCURECODE_EDITOR_NAME"

/** Environment variable name for version (set by CLI at startup) */
export const ENV_VERSION = "ACCURECODE_VERSION"

/** Tester header value for suppressing warnings */
export const TESTER_SUPPRESS_VALUE = "SUPPRESS"

/** Header name for feature tracking */
export const HEADER_FEATURE = "X-ACCURECODE-FEATURE"

/** Environment variable name for feature override */
export const ENV_FEATURE = "ACCURECODE_FEATURE"

export const PROMPTS = [
  "codex",
  "gemini",
  "beast",
  "anthropic",
  "trinity",
  "anthropic_without_todo",
  "ling",
  "gpt55",
] as const

export const AI_SDK_PROVIDERS = [
  "alibaba",
  "anthropic",
  "mistral",
  "openai",
  "openai-compatible",
  "openrouter",
] as const
