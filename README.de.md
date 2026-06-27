<p align="center">
  <a href="README.md">English</a> | <a href="README.zh.md">简体中文</a> | <a href="README.zht.md">繁體中文</a> | <a href="README.ko.md">한국어</a> | Deutsch | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.it.md">Italiano</a> | <a href="README.da.md">Dansk</a> | <a href="README.ja.md">日本語</a> | <a href="README.pl.md">Polski</a> | <a href="README.ru.md">Русский</a> | <a href="README.bs.md">Bosanski</a> | <a href="README.ar.md">العربية</a> | <a href="README.no.md">Norsk</a> | <a href="README.br.md">Português (Brasil)</a> | <a href="README.th.md">ไทย</a> | <a href="README.tr.md">Türkçe</a> | <a href="README.uk.md">Українська</a> | <a href="README.bn.md">বাংলা</a> | <a href="README.gr.md">Ελληνικά</a> | <a href="README.vi.md">Tiếng Việt</a>
</p>

<p align="center">
  <a href="https://accure.ai"><img width="250" alt="Accure Code logo" src="logo.png" /></a>
</p>

<p align="center">Der Open-Source-Coding-Agent zum Entwickeln mit KI in VS Code, JetBrains oder der CLI.</p>

![Accure-in-VS-Code-and-CLI](screenshot.png)

---

Accure Code ist ein KI-Coding-Agent, der überall dort arbeitet, wo du arbeitest: [VS Code](https://accure.ai/landing/vs-code), [JetBrains](https://accure.ai/features/jetbrains-native) und die [CLI](https://accure.ai/cli). Es ist Open Source mit transparenter Preisgestaltung. Du wählst aus über 500 Modellen, wechselst sie mitten in einer Aufgabe und zahlst den Tarif des Modellanbieters ohne Aufschlag. Zum Start sind keine API-Schlüssel erforderlich.

### Installation

Wähle aus, wo du Accure ausführen möchtest.

<details open>
<summary><strong>VS Code</strong></summary>

<br>

Installiere die [Accure Code-Erweiterung](vscode:extension/accurecode.accure-code) direkt oder lade sie aus dem [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=accurecode.Accure-Code). Erstelle ein Konto und erhalte Zugriff auf über 500 Modelle, darunter GPT-5.5, Claude Opus 4.7, Claude Sonnet 4.6 und Gemini 3.1 Pro Preview, alle zu Anbieterpreisen.

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

Führe anschließend `accure` in einem beliebigen Projektverzeichnis aus.

</details>

<details>
<summary><strong>JetBrains</strong></summary>

<br>

Installiere das [Accure Code-Plugin](https://plugins.jetbrains.com/plugin/28350-accure-code) aus dem JetBrains Marketplace oder suche in einer JetBrains-IDE unter `Settings → Plugins` nach "Accure Code".

</details>

<details>
<summary><strong>Cloud Agent</strong></summary>

<br>

Führe Accure im Web aus, ohne lokalen Rechner, unter [app.accure.ai/cloud](https://app.accure.ai/cloud).

</details>

<details>
<summary><strong>Code Reviews</strong></summary>

<br>

Richte automatisierte KI-Code-Reviews für deine Pull Requests unter [app.accure.ai/code-reviews](https://app.accure.ai/code-reviews) ein.

</details>

<details>
<summary><strong>AccureClaw</strong></summary>

<br>

Starte deinen ständig aktiven KI-Agenten unter [app.accure.ai/claw](https://app.accure.ai/claw).

</details>

<details>
<summary>CLI aus GitHub Releases installieren (Binärdateien)</summary>

Lade die neueste Binärdatei von der [Releases-Seite](https://github.com/Accure-Org/accurecode/releases) herunter.

| Plattform | Asset |
|---|---|
| Windows (die meisten PCs) | `accure-windows-x64.zip` |
| macOS (Apple Silicon) | `accure-darwin-arm64.zip` |
| macOS (Intel) | `accure-darwin-x64.zip` |
| Linux x64 | `accure-linux-x64.tar.gz` |
| Linux ARM | `accure-linux-arm64.tar.gz` |

Hinweise: `x64-baseline` ist ein Kompatibilitäts-Build für ältere CPUs ohne AVX. `musl` ist der statisch gelinkte Build für Alpine oder minimale Docker-Images ohne glibc. `accure-vscode-*.vsix` ist das VS Code-Erweiterungspaket, nicht die CLI. `Source code`-Archive dienen dem Bauen aus dem Quellcode.

</details>

### Agents

Accure wird mit spezialisierten Agents ausgeliefert, zwischen denen du je nach Aufgabe wechselst. Du kannst auch eigene Agents erstellen.

- **Code** - Standard. Implementiert und bearbeitet Code aus natürlicher Sprache.
- **Plan** - Entwirft Architektur und schreibt Implementierungspläne, bevor Code geschrieben wird.
- **Ask** - Beantwortet Fragen zu deiner Codebasis, ohne Dateien zu ändern.
- **Debug** - Untersucht und verfolgt Probleme.
- **Review** - Prüft deine Änderungen und findet Probleme bei Performance, Sicherheit, Stil und Testabdeckung.

Mehr erfahren über [Agents und benutzerdefinierte Agents](https://accure.ai/docs/code-with-ai/agents/using-agents).

### Funktionen

- **Codegenerierung** aus natürlicher Sprache über mehrere Dateien hinweg.
- **Inline-Autocomplete** mit Ghost-Text-Vorschlägen und Tab zum Übernehmen.
- **Selbstprüfung**, damit der Agent seine eigene Arbeit prüft und korrigiert.
- **Terminal- und Browsersteuerung**, um Befehle auszuführen und das Web zu automatisieren.
- **MCP-Marktplatz**, um MCP-Server zu finden und einzubinden, die den Agent erweitern.
- **Über 500 Modelle** mit Wechsel während einer Aufgabe, damit du Latenz, Kosten und Reasoning passend zur Aufgabe wählst.

### Autonomer Modus (CI/CD)

Führe `accure run` mit `--auto` für vollständig autonomen Betrieb ohne Prompts aus, geeignet für CI/CD-Pipelines:

```bash
accure run --auto "run tests and fix any failures"
```

`--auto` deaktiviert alle Berechtigungsabfragen und erlaubt dem Agent, jede Aktion ohne Bestätigung auszuführen. Verwende es nur in vertrauenswürdigen Umgebungen.

### Dokumentation

Für Konfiguration und alles Weitere lies die [Dokumentation](https://accure.ai/docs).

### Mitwirken

Beiträge von Entwicklerinnen, Autoren und allen anderen sind willkommen. Beginne mit dem [Contributing Guide](/CONTRIBUTING.md) für Einrichtung, Coding-Standards und Pull Requests. Siehe [RELEASING.md](RELEASING.md) für den Release-Prozess der VS Code-Erweiterung und CLI sowie [packages/accure-jetbrains/RELEASING.md](packages/accure-jetbrains/RELEASING.md) für das JetBrains-Plugin.

Bitte lies unseren [Code of Conduct](/CODE_OF_CONDUCT.md), bevor du mitwirkst.

### Lizenz

MIT. Du darfst diesen Code verwenden, ändern und verbreiten, auch kommerziell, solange du die Attribution und Lizenzhinweise beibehältst. Siehe [License](/LICENSE).

### FAQ

<details>
<summary>Woher stammt Accure CLI?</summary>

Accure CLI ist ein Fork von [OpenCode](https://github.com/Accure-Org/accurecode), erweitert für die Accure-Agentic-Engineering-Plattform.

</details>

---

**Tritt der Community bei** [Discord](https://accure.ai/discord) | [X](https://x.com/accurecode) | [Reddit](https://www.reddit.com/r/accurecode/)
