<p align="center">
  <a href="README.md">English</a> | <a href="README.zh.md">简体中文</a> | <a href="README.zht.md">繁體中文</a> | <a href="README.ko.md">한국어</a> | <a href="README.de.md">Deutsch</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.it.md">Italiano</a> | <a href="README.da.md">Dansk</a> | 日本語 | <a href="README.pl.md">Polski</a> | <a href="README.ru.md">Русский</a> | <a href="README.bs.md">Bosanski</a> | <a href="README.ar.md">العربية</a> | <a href="README.no.md">Norsk</a> | <a href="README.br.md">Português (Brasil)</a> | <a href="README.th.md">ไทย</a> | <a href="README.tr.md">Türkçe</a> | <a href="README.uk.md">Українська</a> | <a href="README.bn.md">বাংলা</a> | <a href="README.gr.md">Ελληνικά</a> | <a href="README.vi.md">Tiếng Việt</a>
</p>

<p align="center">
  <a href="https://accure.ai"><img width="250" alt="Accure Code logo" src="logo.png" /></a>
</p>

<p align="center">VS Code、JetBrains、CLI で AI を使って開発するためのオープンソースのコーディングエージェント。</p>

![Accure-in-VS-Code-and-CLI](screenshot.png)

---

Accure Code は、[VS Code](https://accure.ai/landing/vs-code)、[JetBrains](https://accure.ai/features/jetbrains-native)、[CLI](https://accure.ai/cli) など、あなたが作業する場所で使える AI コーディングエージェントです。オープンソースで、透明な価格体系を採用しています。500 以上のモデルから選択し、タスクの途中で切り替え、追加料金なしでモデルプロバイダーの料金を支払います。開始に API キーは不要です。

### インストール

Accure を実行する場所を選んでください。

<details open>
<summary><strong>VS Code</strong></summary>

<br>

[Accure Code 拡張機能](vscode:extension/accurecode.accure-code)を直接インストールするか、[VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=accurecode.Accure-Code) から入手してください。アカウントを作成すると、GPT-5.5、Claude Opus 4.7、Claude Sonnet 4.6、Gemini 3.1 Pro Preview を含む 500 以上のモデルを、すべてプロバイダー価格で利用できます。

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

その後、任意のプロジェクトディレクトリで `accure` を実行して開始します。

</details>

### Agents

Accure には、タスクに応じて切り替えられる特化型 agents が含まれています。独自のカスタム agents も作成できます。

- **Code** - デフォルト。自然言語からコードを実装、編集します。
- **Plan** - コードを書く前にアーキテクチャを設計し、実装計画を作成します。
- **Ask** - ファイルを変更せずにコードベースに関する質問に答えます。
- **Debug** - 問題のトラブルシューティングと追跡を行います。
- **Review** - 変更をレビューし、パフォーマンス、セキュリティ、スタイル、テストカバレッジの問題を検出します。

[agents とカスタム agents](https://accure.ai/docs/code-with-ai/agents/using-agents) について詳しく学べます。

### 機能

- 自然言語から複数ファイルにわたる **コード生成**。
- ghost-text 提案と Tab での受け入れに対応した **インライン補完**。
- エージェントが自分の作業をレビューして修正する **セルフチェック**。
- コマンド実行と Web 自動化のための **ターミナルとブラウザ制御**。
- エージェントの機能を拡張する MCP サーバーを見つけて接続する **MCP マーケットプレイス**。
- レイテンシ、コスト、推論能力を作業に合わせるため、タスク途中の切り替えに対応した **500 以上のモデル**。

### 自律モード（CI/CD）

CI/CD パイプライン向けに、プロンプトなしで完全自律動作させるには `accure run` に `--auto` を指定します。

```bash
accure run --auto "run tests and fix any failures"
```

`--auto` はすべての権限プロンプトを無効にし、エージェントが確認なしで任意の操作を実行できるようにします。信頼できる環境でのみ使用してください。

### ドキュメント

設定やその他の内容については、[ドキュメント](https://accure.ai/docs)をご覧ください。

### コントリビューション

開発者、ライター、その他すべての方からのコントリビューションを歓迎します。環境設定、コーディング標準、pull request の作成方法については [Contributing Guide](/CONTRIBUTING.md) から始めてください。VS Code 拡張機能と CLI のリリース手順は [RELEASING.md](RELEASING.md)、JetBrains プラグインについては [packages/accure-jetbrains/RELEASING.md](packages/accure-jetbrains/RELEASING.md) を参照してください。

参加する前に [Code of Conduct](/CODE_OF_CONDUCT.md) を確認してください。

### ライセンス

MIT。帰属表示とライセンス通知を保持する限り、商用利用を含め、このコードを使用、変更、配布できます。[License](/LICENSE) を参照してください。

### FAQ

<details>
<summary>Accure CLI はどこから来たのですか？</summary>

Accure CLI は [OpenCode](https://github.com/Accure-Org/accurecode) の fork であり、Accure agentic engineering プラットフォーム内で動作するように強化されています。

</details>

---

**コミュニティに参加** [Discord](https://accure.ai/discord) | [X](https://x.com/accurecode) | [Reddit](https://www.reddit.com/r/accurecode/)
