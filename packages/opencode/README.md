# Accure Code CLI

The AI coding agent built for the terminal. Generate code from natural language, automate tasks, and run terminal commands -- powered by 500+ AI models.

![Accure CLI showing code edits in a terminal](https://raw.githubusercontent.com/Accure-Inc/accure-code/main/packages/accure-docs/public/img/npm-package-readme/accure-cli.png)

Accure is the all-in-one agentic engineering platform. Build, ship, and iterate faster with the most popular open source coding agent.

[Website](https://accure.ai) · [Install](https://accure.ai/install) · [IDE](https://accure.ai/landing/vs-code) · [CLI](https://accure.ai/cli) · [Docs](https://accure.ai/docs) · [Models](https://accure.ai/leaderboard) · [Gateway](https://accure.ai/gateway) · [Pricing](https://accure.ai/pricing) · [Accure Pass](https://accure.ai/pricing/accure-pass)

[500+ models](https://accure.ai/leaderboard). One open source agent in [VS Code](https://accure.ai/vscode-marketplace), [JetBrains](https://plugins.jetbrains.com/plugin/27133-accure-code), [CLI](https://www.npmjs.com/package/@accurecode/cli), [Slack](https://accure.ai/slack), and [Cloud](https://accure.ai/cloud).

## Install

```bash
npm install -g @accurecode/cli
```

Or run directly with npx:

```bash
npx --package @accurecode/cli accure
```

## Getting Started

Run `accure` in any project directory to launch the interactive TUI:

```bash
accure
```

Run a one-off task:

```bash
accure run "add input validation to the signup form"
```

## Features

- **Code generation** -- describe what you want in natural language
- **Terminal commands** -- the agent can run shell commands on your behalf
- **500+ AI models** -- use models from OpenAI, Anthropic, Google, and more
- **MCP servers** -- extend agent capabilities with the Model Context Protocol
- **Multiple modes** -- Plan with Architect, code with Coder, debug with Debugger, or create your own
- **Sessions** -- resume previous conversations and export transcripts
- **API keys optional** -- bring your own keys or use Accure credits

## Commands

| Command               | Description                |
| --------------------- | -------------------------- |
| `accure`                | Launch interactive TUI     |
| `accure run "<task>"`   | Run a one-off task         |
| `accure auth`           | Manage authentication      |
| `accure models`         | List available models      |
| `accure mcp`            | Manage MCP servers         |
| `accure session list`   | List sessions              |
| `accure session delete` | Delete a session           |
| `accure export`         | Export session transcripts |

Run `accure --help` for the full list.

## Alternative Installation

### Homebrew (macOS/Linux)

```bash
brew install Accure-Org/tap/accure
```

### GitHub Releases

Download pre-built binaries from the [Releases page](https://github.com/Accure-Inc/accure-code/releases).

## Documentation

- [Docs](https://accure.ai/docs)
- [Getting Started](https://accure.ai/docs/getting-started)

## Links

- [GitHub](https://github.com/Accure-Inc/accure-code)
- [Discord](https://accure.ai/discord)
- [VS Code Extension](https://accure.ai/vscode-marketplace)
- [Website](https://accure.ai)

## License

MIT
