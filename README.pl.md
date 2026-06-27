<p align="center">
  <a href="README.md">English</a> | <a href="README.zh.md">简体中文</a> | <a href="README.zht.md">繁體中文</a> | <a href="README.ko.md">한국어</a> | <a href="README.de.md">Deutsch</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.it.md">Italiano</a> | <a href="README.da.md">Dansk</a> | <a href="README.ja.md">日本語</a> | Polski | <a href="README.ru.md">Русский</a> | <a href="README.bs.md">Bosanski</a> | <a href="README.ar.md">العربية</a> | <a href="README.no.md">Norsk</a> | <a href="README.br.md">Português (Brasil)</a> | <a href="README.th.md">ไทย</a> | <a href="README.tr.md">Türkçe</a> | <a href="README.uk.md">Українська</a> | <a href="README.bn.md">বাংলা</a> | <a href="README.gr.md">Ελληνικά</a> | <a href="README.vi.md">Tiếng Việt</a>
</p>

<p align="center">
  <a href="https://accure.ai"><img width="250" alt="Accure Code logo" src="logo.png" /></a>
</p>

<p align="center">Open source'owy agent kodujący do pracy z AI w VS Code, JetBrains lub CLI.</p>

![Accure-in-VS-Code-and-CLI](screenshot.png)

---

Accure Code to agent kodujący z AI, który działa wszędzie tam, gdzie pracujesz: w [VS Code](https://accure.ai/landing/vs-code), [JetBrains](https://accure.ai/features/jetbrains-native) i [CLI](https://accure.ai/cli). Jest open source i ma otwarte ceny. Wybierasz spośród ponad 500 modeli, przełączasz się między nimi w trakcie zadania i płacisz stawkę dostawcy modelu bez narzutów. Do rozpoczęcia nie są wymagane klucze API.

### Instalacja

Wybierz, gdzie chcesz uruchomić Accure.

<details open>
<summary><strong>VS Code</strong></summary>

<br>

Zainstaluj bezpośrednio [rozszerzenie Accure Code](vscode:extension/accurecode.accure-code) albo pobierz je z [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=accurecode.Accure-Code). Utwórz konto, a otrzymasz dostęp do ponad 500 modeli, w tym GPT-5.5, Claude Opus 4.7, Claude Sonnet 4.6 i Gemini 3.1 Pro Preview, wszystkie w cenach dostawców.

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

Następnie uruchom `accure` w dowolnym katalogu projektu.

</details>

<details>
<summary><strong>JetBrains</strong></summary>

<br>

Zainstaluj [plugin Accure Code](https://plugins.jetbrains.com/plugin/28350-accure-code) z JetBrains Marketplace albo wyszukaj "Accure Code" w `Settings → Plugins` w dowolnym IDE JetBrains.

</details>

<details>
<summary><strong>Cloud Agent</strong></summary>

<br>

Uruchom Accure z poziomu przeglądarki, bez lokalnej maszyny, na [app.accure.ai/cloud](https://app.accure.ai/cloud).

</details>

<details>
<summary><strong>Przeglądy kodu</strong></summary>

<br>

Skonfiguruj automatyczne przeglądy kodu AI dla swoich pull requestów na [app.accure.ai/code-reviews](https://app.accure.ai/code-reviews).

</details>

<details>
<summary><strong>AccureClaw</strong></summary>

<br>

Uruchom swojego zawsze aktywnego agenta AI na [app.accure.ai/claw](https://app.accure.ai/claw).

</details>

<details>
<summary>Zainstaluj CLI z GitHub Releases (pliki binarne)</summary>

Pobierz najnowszy plik binarny ze [strony Releases](https://github.com/Accure-Org/accurecode/releases).

| Platforma | Zasób |
|---|---|
| Windows (większość PC) | `accure-windows-x64.zip` |
| macOS (Apple Silicon) | `accure-darwin-arm64.zip` |
| macOS (Intel) | `accure-darwin-x64.zip` |
| Linux x64 | `accure-linux-x64.tar.gz` |
| Linux ARM | `accure-linux-arm64.tar.gz` |

Uwagi: `x64-baseline` to build zgodności dla starszych CPU bez AVX. `musl` to statycznie linkowany build dla Alpine lub minimalnych obrazów Docker bez glibc. `accure-vscode-*.vsix` to pakiet rozszerzenia VS Code, nie CLI. Archiwa `Source code` służą do budowania ze źródeł.

</details>

### Agents

Accure zawiera wyspecjalizowane agents, między którymi możesz przełączać się zależnie od zadania. Możesz też tworzyć własne niestandardowe agents.

- **Code** - Domyślny. Implementuje i edytuje kod z języka naturalnego.
- **Plan** - Projektuje architekturę i pisze plany implementacji przed napisaniem kodu.
- **Ask** - Odpowiada na pytania o bazę kodu bez modyfikowania plików.
- **Debug** - Diagnozuje i śledzi problemy.
- **Review** - Przegląda zmiany i wykrywa problemy z wydajnością, bezpieczeństwem, stylem i pokryciem testami.

Dowiedz się więcej o [agents i niestandardowych agents](https://accure.ai/docs/code-with-ai/agents/using-agents).

### Co robi

- **Generowanie kodu** z języka naturalnego, w wielu plikach.
- **Autouzupełnianie inline** z sugestiami ghost-text i akceptacją przez Tab.
- **Samokontrola**, dzięki której agent sprawdza i poprawia własną pracę.
- **Sterowanie terminalem i przeglądarką** do uruchamiania poleceń i automatyzacji webu.
- **Marketplace MCP** do znajdowania i podłączania serwerów MCP rozszerzających możliwości agenta.
- **Ponad 500 modeli** z przełączaniem w trakcie zadania, aby dopasować opóźnienie, koszt i rozumowanie do pracy.

### Tryb autonomiczny (CI/CD)

Uruchom `accure run` z `--auto`, aby działać w pełni autonomicznie bez promptów, z myślą o pipeline'ach CI/CD:

```bash
accure run --auto "run tests and fix any failures"
```

`--auto` wyłącza wszystkie pytania o uprawnienia i pozwala agentowi wykonywać dowolne działania bez potwierdzenia. Używaj tylko w zaufanych środowiskach.

### Dokumentacja

Konfigurację i wszystko inne znajdziesz w [dokumentacji](https://accure.ai/docs).

### Wkład

Zapraszamy do wkładu programistów, autorów i wszystkich innych. Zacznij od [Contributing Guide](/CONTRIBUTING.md), aby skonfigurować środowisko, poznać standardy kodowania i sposób otwierania pull requestów. Zobacz [RELEASING.md](RELEASING.md) dla procesu wydawania rozszerzenia VS Code i CLI oraz [packages/accure-jetbrains/RELEASING.md](packages/accure-jetbrains/RELEASING.md) dla pluginu JetBrains.

Przed zaangażowaniem przeczytaj nasz [Code of Conduct](/CODE_OF_CONDUCT.md).

### Licencja

MIT. Możesz używać, modyfikować i dystrybuować ten kod, również komercyjnie, o ile zachowasz informacje o autorstwie i licencji. Zobacz [License](/LICENSE).

### FAQ

<details>
<summary>Skąd pochodzi Accure CLI?</summary>

Accure CLI jest forkiem [OpenCode](https://github.com/Accure-Org/accurecode), rozszerzonym do działania w platformie agentic engineering Accure.

</details>

---

**Dołącz do społeczności** [Discord](https://accure.ai/discord) | [X](https://x.com/accurecode) | [Reddit](https://www.reddit.com/r/accurecode/)
