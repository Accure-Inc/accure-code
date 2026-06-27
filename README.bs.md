<p align="center">
  <a href="README.md">English</a> | <a href="README.zh.md">简体中文</a> | <a href="README.zht.md">繁體中文</a> | <a href="README.ko.md">한국어</a> | <a href="README.de.md">Deutsch</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.it.md">Italiano</a> | <a href="README.da.md">Dansk</a> | <a href="README.ja.md">日本語</a> | <a href="README.pl.md">Polski</a> | <a href="README.ru.md">Русский</a> | Bosanski | <a href="README.ar.md">العربية</a> | <a href="README.no.md">Norsk</a> | <a href="README.br.md">Português (Brasil)</a> | <a href="README.th.md">ไทย</a> | <a href="README.tr.md">Türkçe</a> | <a href="README.uk.md">Українська</a> | <a href="README.bn.md">বাংলা</a> | <a href="README.gr.md">Ελληνικά</a> | <a href="README.vi.md">Tiếng Việt</a>
</p>

<p align="center">
  <a href="https://accure.ai"><img width="250" alt="Accure Code logo" src="logo.png" /></a>
</p>

<p align="center">Open source agent za kodiranje s AI-jem u VS Codeu, JetBrainsu ili CLI-ju.</p>

![Accure-in-VS-Code-and-CLI](screenshot.png)

---

Accure Code je AI agent za kodiranje koji vas prati svugdje gdje radite: [VS Code](https://accure.ai/landing/vs-code), [JetBrains](https://accure.ai/features/jetbrains-native) i [CLI](https://accure.ai/cli). Open source je i ima otvorene cijene. Birate između više od 500 modela, mijenjate ih usred zadatka i plaćate cijenu pružaoca modela bez dodatne marže. API ključevi nisu potrebni za početak.

### Instalacija

Odaberite gdje želite pokrenuti Accure.

<details open>
<summary><strong>VS Code</strong></summary>

<br>

Instalirajte [Accure Code ekstenziju](vscode:extension/accurecode.accure-code) direktno ili je preuzmite sa [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=accurecode.Accure-Code). Kreirajte račun i imat ćete pristup za više od 500 modela, uključujući GPT-5.5, Claude Opus 4.7, Claude Sonnet 4.6 i Gemini 3.1 Pro Preview, sve po cijenama pružaoca.

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

Zatim pokrenite `accure` u bilo kojem direktoriju projekta.

</details>

### Agents

Accure dolazi sa specijaliziranim agents koje mijenjate zavisno od zadatka. Možete napraviti i vlastite prilagođene agents.

- **Code** - Zadani. Implementira i uređuje kod iz prirodnog jezika.
- **Plan** - Dizajnira arhitekturu i piše implementacijske planove prije pisanja koda.
- **Ask** - Odgovara na pitanja o codebaseu bez mijenjanja datoteka.
- **Debug** - Rješava i prati probleme.
- **Review** - Pregleda vaše promjene i pronalazi probleme u performansama, sigurnosti, stilu i pokrivenosti testovima.

Saznajte više o [agents i prilagođenim agents](https://accure.ai/docs/code-with-ai/agents/using-agents).

### Šta radi

- **Generisanje koda** iz prirodnog jezika, kroz više datoteka.
- **Inline autocomplete** sa ghost-text prijedlozima i Tab za prihvatanje.
- **Samoprovjera** kako bi agent pregledao i ispravio vlastiti rad.
- **Kontrola terminala i browsera** za pokretanje komandi i automatizaciju weba.
- **MCP marketplace** za pronalaženje i povezivanje MCP servera koji proširuju mogućnosti agenta.
- **Više od 500 modela** sa prebacivanjem usred zadatka, da uskladite latenciju, cijenu i rezonovanje s poslom.

### Autonomni način rada (CI/CD)

Pokrenite `accure run` s `--auto` za potpuno autonoman rad bez promptova, napravljen za CI/CD pipelineove:

```bash
accure run --auto "run tests and fix any failures"
```

`--auto` isključuje sve upite za dozvole i dopušta agentu da izvrši bilo koju radnju bez potvrde. Koristite samo u pouzdanim okruženjima.

### Dokumentacija

Za konfiguraciju i sve ostalo posjetite [dokumentaciju](https://accure.ai/docs).

### Doprinos

Doprinosi su dobrodošli od developera, pisaca i svih ostalih. Počnite sa [Contributing Guide](/CONTRIBUTING.md) za podešavanje okruženja, standarde kodiranja i otvaranje pull requesta. Pogledajte [RELEASING.md](RELEASING.md) za proces izdavanja VS Code ekstenzije i CLI-ja, te [packages/accure-jetbrains/RELEASING.md](packages/accure-jetbrains/RELEASING.md) za JetBrains plugin.

Prije uključivanja pročitajte naš [Code of Conduct](/CODE_OF_CONDUCT.md).

### Licenca

MIT. Možete koristiti, mijenjati i distribuirati ovaj kod, uključujući komercijalno, dok god zadržite atribuciju i obavijesti o licenci. Pogledajte [License](/LICENSE).

### FAQ

<details>
<summary>Odakle dolazi Accure CLI?</summary>

Accure CLI je fork [OpenCode](https://github.com/Accure-Org/accurecode), poboljšan za rad unutar Accure agentic engineering platforme.

</details>

---

**Pridružite se zajednici** [Discord](https://accure.ai/discord) | [X](https://x.com/accurecode) | [Reddit](https://www.reddit.com/r/accurecode/)
