<p align="center">
  <a href="README.md">English</a> | 简体中文 | <a href="README.zht.md">繁體中文</a> | <a href="README.ko.md">한국어</a> | <a href="README.de.md">Deutsch</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.it.md">Italiano</a> | <a href="README.da.md">Dansk</a> | <a href="README.ja.md">日本語</a> | <a href="README.pl.md">Polski</a> | <a href="README.ru.md">Русский</a> | <a href="README.bs.md">Bosanski</a> | <a href="README.ar.md">العربية</a> | <a href="README.no.md">Norsk</a> | <a href="README.br.md">Português (Brasil)</a> | <a href="README.th.md">ไทย</a> | <a href="README.tr.md">Türkçe</a> | <a href="README.uk.md">Українська</a> | <a href="README.bn.md">বাংলা</a> | <a href="README.gr.md">Ελληνικά</a> | <a href="README.vi.md">Tiếng Việt</a>
</p>

<p align="center">
  <a href="https://accure.ai"><img width="250" alt="Accure Code logo" src="logo.png" /></a>
</p>

<p align="center">用于在 VS Code、JetBrains 或 CLI 中借助 AI 构建的开源编码代理。</p>

![Accure-in-VS-Code-and-CLI](screenshot.png)

---

Accure Code 是一个 AI 编码代理，可以在你工作的任何地方使用：[VS Code](https://accure.ai/landing/vs-code)、[JetBrains](https://accure.ai/features/jetbrains-native) 和 [CLI](https://accure.ai/cli)。它是开源的，并采用开放定价。你可以从 500 多个模型中选择，在任务中途切换模型，并按模型提供商的价格付费，没有加价。开始使用无需 API 密钥。

### 安装

选择你想运行 Accure 的位置。

<details open>
<summary><strong>VS Code</strong></summary>

<br>

直接安装 [Accure Code 扩展](vscode:extension/accurecode.accure-code)，或从 [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=accurecode.Accure-Code) 获取。创建账户后，你可以按提供商价格访问 500 多个模型，包括 GPT-5.5、Claude Opus 4.7、Claude Sonnet 4.6 和 Gemini 3.1 Pro Preview。

</details>

<details open>
<summary><strong>CLI</strong></summary>

<br>

```bash
# npm
npm install -g @accurecode/cli

# curl
curl -fsSL https://accure.ai/cli/install | bash

# pnpm
pnpm add -g @accurecode/cli

# bun
bun add -g @accurecode/cli

# Homebrew (macOS / Linux)
brew install Accure-Org/tap/accure

# Arch Linux (AUR)
paru -S accure-bin
```

然后在任意项目目录中运行 `accure` 即可开始。

</details>

### Agents

Accure 内置了可按任务切换的专用 Agents。你也可以构建自己的自定义 Agents。

- **Code** - 默认模式。根据自然语言实现和编辑代码。
- **Plan** - 在编写任何代码之前设计架构并编写实现计划。
- **Ask** - 回答有关代码库的问题，不修改任何文件。
- **Debug** - 排查并追踪问题。
- **Review** - 审查你的更改，并从性能、安全、风格和测试覆盖率等方面发现问题。

了解更多关于 [agents 和自定义 agents](https://accure.ai/docs/code-with-ai/agents/using-agents) 的信息。

### 功能

- **代码生成**：基于自然语言跨多个文件生成代码。
- **内联自动补全**：提供 ghost-text 建议，按 Tab 接受。
- **自检**：让代理审查并修正自己的工作。
- **终端和浏览器控制**：运行命令并自动化网页操作。
- **MCP 市场**：查找并连接 MCP 服务器，扩展代理能力。
- **500 多个模型**：支持任务中途切换，让你根据延迟、成本和推理能力匹配任务。

### 自主模式（CI/CD）

使用 `--auto` 运行 `accure run`，可在 CI/CD 流水线中实现无提示的完全自主操作：

```bash
accure run --auto "run tests and fix any failures"
```

`--auto` 会禁用所有权限提示，并允许代理在无需确认的情况下执行任何操作。仅在可信环境中使用。

### 文档

关于配置和其他内容，请查看[文档](https://accure.ai/docs)。

### 贡献

欢迎开发者、写作者以及所有人参与贡献。请先阅读 [Contributing Guide](/CONTRIBUTING.md)，了解环境设置、编码标准以及如何创建 Pull Request。VS Code 扩展和 CLI 的发布流程请参阅 [RELEASING.md](RELEASING.md)，JetBrains 插件请参阅 [packages/accure-jetbrains/RELEASING.md](packages/accure-jetbrains/RELEASING.md)。

参与前请阅读我们的 [Code of Conduct](/CODE_OF_CONDUCT.md)。

### 许可证

MIT。你可以使用、修改和分发此代码，包括商业用途，只要保留署名和许可证声明。参见 [License](/LICENSE)。

### FAQ

<details>
<summary>Accure CLI 从哪里来？</summary>

Accure CLI 是 [OpenCode](https://github.com/Accure-Org/accurecode) 的一个 fork，并增强为可在 Accure agentic engineering 平台中使用。

</details>

---

**加入社区** [Discord](https://accure.ai/discord) | [X](https://x.com/accurecode) | [Reddit](https://www.reddit.com/r/accurecode/)
