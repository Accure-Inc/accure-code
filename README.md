<p align="center">
  <img width="250" alt="Accure Code logo" src="logo.png" />
</p>

<p align="center">The open-source autonomous AI coding agent that runs in VS Code and the CLI.</p>

<p align="center">
  <img src="screenshot.png" alt="Accure Code in Action" width="100%" />
</p>

---

Accure Code is an AI software engineer that edits files, runs terminal commands, and automates tasks directly in your development environment.

### Capabilities

- **Autonomous Coding**: Edits and creates files across multiple directories from a single prompt.
- **Terminal Control**: Safely executes commands, builds code, runs test suites, and fixes test failures.
- **Web Browser Automation**: Runs browser-based tests and interacts with web UI elements to verify frontend changes.
- **Multi-Model Orchestration**: Connects to the leading AI models, allowing you to match reasoning capacity and cost to the task.
- **Specialized Agents**: Swap between specialized modes (Code, Ask, Plan, Debug, Review) depending on your needs.

---

### Installation & Usage

#### VS Code Extension
Search for **Accure Code** in the VS Code Extensions Marketplace and install it. Open the sidebar chat pane to start coding.

#### Command Line Interface (CLI)
Install the CLI globally using your preferred package manager:

```bash
# npm
npm install -g @accurecode/cli

# curl installation script
curl -fsSL https://accure.ai/cli/install | bash

# bun
bun add -g @accurecode/cli
```

Start the interactive coding assistant in any project folder:
```bash
accure
```

To run tasks autonomously (useful for CI/CD pipelines):
```bash
accure run --auto "run tests and fix any failures"
```

---

### License

MIT License. See the LICENSE file for details.
