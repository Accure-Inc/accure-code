# @accurecode/accure-gateway

Unified Accure Gateway package for OpenCode providing authentication, AI provider integration, and API access.

## Features

- **Authentication**: Device authorization flow for Accure Gateway
- **AI Provider**: OpenRouter-based provider with Accure Gateway integration
- **API Integration**: Profile, balance, and model management
- **TUI Helpers**: Utilities for terminal UI components

## Installation

```bash
bun add @accurecode/accure-gateway
```

## Usage

### Plugin Registration

```typescript
import { AccureAuthPlugin } from "@accurecode/accure-gateway"

// Register with OpenCode
const plugins = [AccureAuthPlugin]
```

### Provider Usage

```typescript
import { createAccure } from "@accurecode/accure-gateway"

const provider = createAccure({
  accurecodeToken: process.env.ACCURECODE_API_KEY,
  accurecodeOrganizationId: "org-123",
})

const model = provider.languageModel("anthropic/claude-sonnet-4")
```

### API Access

```typescript
import { fetchProfile, fetchBalance } from "@accurecode/accure-gateway"

const profile = await fetchProfile(token)
const balance = await fetchBalance(token)
```

## License

MIT
