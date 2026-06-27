<p align="center">
  <a href="README.md">English</a> | <a href="README.zh.md">简体中文</a> | <a href="README.zht.md">繁體中文</a> | <a href="README.ko.md">한국어</a> | <a href="README.de.md">Deutsch</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.it.md">Italiano</a> | <a href="README.da.md">Dansk</a> | <a href="README.ja.md">日本語</a> | <a href="README.pl.md">Polski</a> | <a href="README.ru.md">Русский</a> | <a href="README.bs.md">Bosanski</a> | <a href="README.ar.md">العربية</a> | <a href="README.no.md">Norsk</a> | <a href="README.br.md">Português (Brasil)</a> | <a href="README.th.md">ไทย</a> | <a href="README.tr.md">Türkçe</a> | <a href="README.uk.md">Українська</a> | বাংলা | <a href="README.gr.md">Ελληνικά</a> | <a href="README.vi.md">Tiếng Việt</a>
</p>

<p align="center">
  <a href="https://accure.ai"><img width="250" alt="Accure Code logo" src="logo.png" /></a>
</p>

<p align="center">VS Code, JetBrains বা CLI-তে AI দিয়ে তৈরি করার জন্য ওপেন সোর্স কোডিং এজেন্ট।</p>

![Accure-in-VS-Code-and-CLI](screenshot.png)

---

Accure Code হলো একটি AI কোডিং এজেন্ট যা আপনি যেখানে কাজ করেন সেখানেই কাজ করে: [VS Code](https://accure.ai/landing/vs-code), [JetBrains](https://accure.ai/features/jetbrains-native) এবং [CLI](https://accure.ai/cli)। এটি ওপেন সোর্স এবং খোলা মূল্যনীতির। আপনি 500টির বেশি মডেল থেকে বেছে নিতে পারেন, কাজের মাঝখানে মডেল বদলাতে পারেন এবং কোনো অতিরিক্ত চার্জ ছাড়াই মডেল প্রদানকারীর রেট পরিশোধ করেন। শুরু করতে API key দরকার নেই।

### ইনস্টলেশন

আপনি কোথায় Accure চালাতে চান তা বেছে নিন।

<details open>
<summary><strong>VS Code</strong></summary>

<br>

[Accure Code extension](vscode:extension/accurecode.accure-code) সরাসরি ইনস্টল করুন, অথবা [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=accurecode.Accure-Code) থেকে নিন। একটি অ্যাকাউন্ট তৈরি করলে GPT-5.5, Claude Opus 4.7, Claude Sonnet 4.6 এবং Gemini 3.1 Pro Preview সহ 500টির বেশি মডেলে প্রদানকারীর দামে অ্যাক্সেস পাবেন।

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

তারপর শুরু করতে যেকোনো প্রজেক্ট ডিরেক্টরিতে `accure` চালান।

</details>

### Agents

Accure বিশেষায়িত agents সহ আসে, কাজ অনুযায়ী আপনি এগুলোর মধ্যে বদলাতে পারেন। আপনি নিজের custom agents-ও বানাতে পারেন।

- **Code** - ডিফল্ট। প্রাকৃতিক ভাষা থেকে কোড implement এবং edit করে।
- **Plan** - কোনো কোড লেখার আগে architecture design করে এবং implementation plan লেখে।
- **Ask** - কোনো ফাইল না ছুঁয়ে আপনার codebase সম্পর্কে প্রশ্নের উত্তর দেয়।
- **Debug** - সমস্যা troubleshoot এবং trace করে।
- **Review** - আপনার পরিবর্তন review করে এবং performance, security, style ও test coverage-এর সমস্যা তুলে ধরে।

[agents এবং custom agents](https://accure.ai/docs/code-with-ai/agents/using-agents) সম্পর্কে আরও জানুন।

### এটি কী করে

- প্রাকৃতিক ভাষা থেকে একাধিক ফাইলে **code generation**।
- ghost-text suggestion এবং Tab দিয়ে accept করার **inline autocomplete**।
- agent যেন নিজের কাজ review ও correct করে তার জন্য **self-checking**।
- command চালানো এবং web automate করার জন্য **terminal ও browser control**।
- agent-এর ক্ষমতা বাড়ায় এমন MCP server খুঁজে ও যুক্ত করার জন্য **MCP marketplace**।
- latency, cost এবং reasoning কাজের সাথে মেলাতে mid-task switching সহ **500টির বেশি model**।

### Autonomous Mode (CI/CD)

CI/CD pipeline-এর জন্য prompts ছাড়া পুরোপুরি autonomous operation পেতে `accure run`-এর সাথে `--auto` ব্যবহার করুন:

```bash
accure run --auto "run tests and fix any failures"
```

`--auto` সব permission prompt বন্ধ করে এবং agent-কে confirmation ছাড়া যেকোনো action execute করতে দেয়। শুধু trusted environment-এ ব্যবহার করুন।

### ডকুমেন্টেশন

Configuration এবং বাকি সবকিছুর জন্য [docs](https://accure.ai/docs) দেখুন।

### Contributing

Developer, writer এবং সবাইকে contribution-এর জন্য স্বাগতম। environment setup, coding standard এবং pull request খোলার পদ্ধতির জন্য [Contributing Guide](/CONTRIBUTING.md) দিয়ে শুরু করুন। VS Code extension এবং CLI release process-এর জন্য [RELEASING.md](RELEASING.md), এবং JetBrains plugin-এর জন্য [packages/accure-jetbrains/RELEASING.md](packages/accure-jetbrains/RELEASING.md) দেখুন।

অংশ নেওয়ার আগে আমাদের [Code of Conduct](/CODE_OF_CONDUCT.md) পড়ুন।

### License

MIT। attribution এবং license notice রেখে আপনি এই code ব্যবহার, পরিবর্তন এবং distribute করতে পারেন, commercial ব্যবহারসহ। [License](/LICENSE) দেখুন।

### FAQ

<details>
<summary>Accure CLI কোথা থেকে এসেছে?</summary>

Accure CLI হলো [OpenCode](https://github.com/Accure-Org/accurecode)-এর একটি fork, Accure agentic engineering platform-এর মধ্যে কাজ করার জন্য উন্নত করা হয়েছে।

</details>

---

**কমিউনিটিতে যোগ দিন** [Discord](https://accure.ai/discord) | [X](https://x.com/accurecode) | [Reddit](https://www.reddit.com/r/accurecode/)
