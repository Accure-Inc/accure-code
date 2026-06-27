<p align="center">
  <a href="README.md">English</a> | <a href="README.zh.md">简体中文</a> | <a href="README.zht.md">繁體中文</a> | <a href="README.ko.md">한국어</a> | <a href="README.de.md">Deutsch</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.it.md">Italiano</a> | Dansk | <a href="README.ja.md">日本語</a> | <a href="README.pl.md">Polski</a> | <a href="README.ru.md">Русский</a> | <a href="README.bs.md">Bosanski</a> | <a href="README.ar.md">العربية</a> | <a href="README.no.md">Norsk</a> | <a href="README.br.md">Português (Brasil)</a> | <a href="README.th.md">ไทย</a> | <a href="README.tr.md">Türkçe</a> | <a href="README.uk.md">Українська</a> | <a href="README.bn.md">বাংলা</a> | <a href="README.gr.md">Ελληνικά</a> | <a href="README.vi.md">Tiếng Việt</a>
</p>

<p align="center">
  <a href="https://accure.ai"><img width="250" alt="Accure Code logo" src="logo.png" /></a>
</p>

<p align="center">Den open source-kodeagent til at bygge med AI i VS Code, JetBrains eller CLI.</p>

![Accure-in-VS-Code-and-CLI](screenshot.png)

---

Accure Code er en AI-kodeagent, der møder dig overalt, hvor du arbejder: [VS Code](https://accure.ai/landing/vs-code), [JetBrains](https://accure.ai/features/jetbrains-native) og [CLI](https://accure.ai/cli). Den er open source med åben prissætning. Du vælger mellem mere end 500 modeller, skifter mellem dem midt i en opgave og betaler modeludbyderens pris uden tillæg. Ingen API-nøgler kræves for at komme i gang.

### Installation

Vælg, hvor du vil køre Accure.

<details open>
<summary><strong>VS Code</strong></summary>

<br>

Installer [Accure Code-udvidelsen](vscode:extension/accurecode.accure-code) direkte, eller hent den fra [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=accurecode.Accure-Code). Opret en konto, og du får adgang til mere end 500 modeller, herunder GPT-5.5, Claude Opus 4.7, Claude Sonnet 4.6 og Gemini 3.1 Pro Preview, alle til udbyderpris.

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

Kør derefter `accure` i en vilkårlig projektmappe for at starte.

</details>

### Agents

Accure leveres med specialiserede agents, som du kan skifte mellem afhængigt af opgaven. Du kan også bygge dine egne brugerdefinerede agents.

- **Code** - Standard. Implementerer og redigerer kode fra naturligt sprog.
- **Plan** - Designer arkitektur og skriver implementeringsplaner, før der skrives kode.
- **Ask** - Besvarer spørgsmål om din kodebase uden at ændre filer.
- **Debug** - Fejlfinder og sporer problemer.
- **Review** - Gennemgår dine ændringer og finder problemer med ydeevne, sikkerhed, stil og testdækning.

Læs mere om [agents og brugerdefinerede agents](https://accure.ai/docs/code-with-ai/agents/using-agents).

### Hvad den gør

- **Kodegenerering** fra naturligt sprog på tværs af flere filer.
- **Inline-autocomplete** med ghost-text-forslag og Tab for at acceptere.
- **Selvkontrol**, så agenten gennemgår og retter sit eget arbejde.
- **Terminal- og browserkontrol** til at køre kommandoer og automatisere webben.
- **MCP-markedsplads** til at finde og tilslutte MCP-servere, der udvider agentens muligheder.
- **Mere end 500 modeller** med skift midt i opgaven, så du kan matche latenstid, pris og ræsonnement til arbejdet.

### Autonom tilstand (CI/CD)

Kør `accure run` med `--auto` for fuldt autonom drift uden prompts, bygget til CI/CD-pipelines:

```bash
accure run --auto "run tests and fix any failures"
```

`--auto` deaktiverer alle tilladelsesprompts og lader agenten udføre enhver handling uden bekræftelse. Brug det kun i betroede miljøer.

### Dokumentation

For konfiguration og alt andet, se [dokumentationen](https://accure.ai/docs).

### Bidrag

Bidrag er velkomne fra udviklere, forfattere og alle andre. Start med [Contributing Guide](/CONTRIBUTING.md) for miljøopsætning, kodestandarder og hvordan du åbner en pull request. Se [RELEASING.md](RELEASING.md) for releaseprocessen for VS Code-udvidelsen og CLI'en, og [packages/accure-jetbrains/RELEASING.md](packages/accure-jetbrains/RELEASING.md) for JetBrains-pluginet.

Læs venligst vores [Code of Conduct](/CODE_OF_CONDUCT.md), før du deltager.

### Licens

MIT. Du kan bruge, ændre og distribuere denne kode, også kommercielt, så længe du beholder attribution og licensmeddelelser. Se [License](/LICENSE).

### FAQ

<details>
<summary>Hvor kommer Accure CLI fra?</summary>

Accure CLI er en fork af [OpenCode](https://github.com/Accure-Org/accurecode), forbedret til at fungere i Accure agentic engineering-platformen.

</details>

---

**Deltag i fællesskabet** [Discord](https://accure.ai/discord) | [X](https://x.com/accurecode) | [Reddit](https://www.reddit.com/r/accurecode/)
