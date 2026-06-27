<p align="center">
  <a href="README.md">English</a> | <a href="README.zh.md">简体中文</a> | <a href="README.zht.md">繁體中文</a> | <a href="README.ko.md">한국어</a> | <a href="README.de.md">Deutsch</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | Italiano | <a href="README.da.md">Dansk</a> | <a href="README.ja.md">日本語</a> | <a href="README.pl.md">Polski</a> | <a href="README.ru.md">Русский</a> | <a href="README.bs.md">Bosanski</a> | <a href="README.ar.md">العربية</a> | <a href="README.no.md">Norsk</a> | <a href="README.br.md">Português (Brasil)</a> | <a href="README.th.md">ไทย</a> | <a href="README.tr.md">Türkçe</a> | <a href="README.uk.md">Українська</a> | <a href="README.bn.md">বাংলা</a> | <a href="README.gr.md">Ελληνικά</a> | <a href="README.vi.md">Tiếng Việt</a>
</p>

<p align="center">
  <a href="https://accure.ai"><img width="250" alt="Accure Code logo" src="logo.png" /></a>
</p>

<p align="center">L'agente di coding open source per creare con l'IA in VS Code, JetBrains o nella CLI.</p>

![Accure-in-VS-Code-and-CLI](screenshot.png)

---

Accure Code è un agente di coding con IA che ti segue ovunque lavori: [VS Code](https://accure.ai/landing/vs-code), [JetBrains](https://accure.ai/features/jetbrains-native) e la [CLI](https://accure.ai/cli). È open source con prezzi trasparenti. Puoi scegliere tra oltre 500 modelli, passare da uno all'altro durante un'attività e pagare la tariffa del provider del modello senza ricarichi. Non servono chiavi API per iniziare.

### Installazione

Scegli dove vuoi eseguire Accure.

<details open>
<summary><strong>VS Code</strong></summary>

<br>

Installa direttamente l'[estensione Accure Code](vscode:extension/accurecode.accure-code), oppure scaricala dal [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=accurecode.Accure-Code). Crea un account e avrai accesso a oltre 500 modelli, inclusi GPT-5.5, Claude Opus 4.7, Claude Sonnet 4.6 e Gemini 3.1 Pro Preview, tutti al prezzo del provider.

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

Poi esegui `accure` in qualsiasi directory di progetto per iniziare.

</details>

### Agents

Accure include agents specializzati tra cui puoi passare in base all'attività. Puoi anche creare agents personalizzati.

- **Code** - Predefinito. Implementa e modifica codice da linguaggio naturale.
- **Plan** - Progetta l'architettura e scrive piani di implementazione prima che venga scritto codice.
- **Ask** - Risponde a domande sulla tua codebase senza modificare file.
- **Debug** - Risolve e traccia problemi.
- **Review** - Revisiona le modifiche e segnala problemi di performance, sicurezza, stile e copertura dei test.

Scopri di più su [agents e agents personalizzati](https://accure.ai/docs/code-with-ai/agents/using-agents).

### Cosa fa

- **Generazione di codice** da linguaggio naturale, su più file.
- **Autocompletamento inline** con suggerimenti ghost-text e Tab per accettare.
- **Autoverifica** così l'agente rivede e corregge il proprio lavoro.
- **Controllo di terminale e browser** per eseguire comandi e automatizzare il web.
- **Marketplace MCP** per trovare e collegare server MCP che estendono ciò che l'agente può fare.
- **Oltre 500 modelli** con cambio durante l'attività, per adattare latenza, costo e ragionamento al lavoro.

### Modalità autonoma (CI/CD)

Esegui `accure run` con `--auto` per un funzionamento completamente autonomo senza prompt, pensato per pipeline CI/CD:

```bash
accure run --auto "run tests and fix any failures"
```

`--auto` disabilita tutti i prompt di autorizzazione e consente all'agente di eseguire qualsiasi azione senza conferma. Usalo solo in ambienti attendibili.

### Documentazione

Per configurazione e tutto il resto, consulta la [documentazione](https://accure.ai/docs).

### Contribuire

Sono benvenuti contributi da sviluppatori, autori e chiunque altro. Inizia dalla [Guida al contributo](/CONTRIBUTING.md) per configurazione dell'ambiente, standard di codice e apertura di una pull request. Consulta [RELEASING.md](RELEASING.md) per il processo di rilascio dell'estensione VS Code e della CLI, e [packages/accure-jetbrains/RELEASING.md](packages/accure-jetbrains/RELEASING.md) per il plugin JetBrains.

Leggi il nostro [Codice di condotta](/CODE_OF_CONDUCT.md) prima di partecipare.

### Licenza

MIT. Puoi usare, modificare e distribuire questo codice, anche commercialmente, purché mantieni le note di attribuzione e licenza. Vedi [License](/LICENSE).

### FAQ

<details>
<summary>Da dove viene Accure CLI?</summary>

Accure CLI è un fork di [OpenCode](https://github.com/Accure-Org/accurecode), migliorato per funzionare nella piattaforma di ingegneria agentica Accure.

</details>

---

**Unisciti alla community** [Discord](https://accure.ai/discord) | [X](https://x.com/accurecode) | [Reddit](https://www.reddit.com/r/accurecode/)
