<p align="center">
  <a href="README.md">English</a> | <a href="README.zh.md">简体中文</a> | <a href="README.zht.md">繁體中文</a> | <a href="README.ko.md">한국어</a> | <a href="README.de.md">Deutsch</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.it.md">Italiano</a> | <a href="README.da.md">Dansk</a> | <a href="README.ja.md">日本語</a> | <a href="README.pl.md">Polski</a> | <a href="README.ru.md">Русский</a> | <a href="README.bs.md">Bosanski</a> | <a href="README.ar.md">العربية</a> | <a href="README.no.md">Norsk</a> | Português (Brasil) | <a href="README.th.md">ไทย</a> | <a href="README.tr.md">Türkçe</a> | <a href="README.uk.md">Українська</a> | <a href="README.bn.md">বাংলা</a> | <a href="README.gr.md">Ελληνικά</a> | <a href="README.vi.md">Tiếng Việt</a>
</p>

<p align="center">
  <a href="https://accure.ai"><img width="250" alt="Accure Code logo" src="logo.png" /></a>
</p>

<p align="center">O agente de programação open source para criar com IA no VS Code, JetBrains ou CLI.</p>

![Accure-in-VS-Code-and-CLI](screenshot.png)

---

Accure Code é um agente de programação com IA que acompanha você em todos os lugares onde trabalha: [VS Code](https://accure.ai/landing/vs-code), [JetBrains](https://accure.ai/features/jetbrains-native) e [CLI](https://accure.ai/cli). É open source e tem preços abertos. Você escolhe entre mais de 500 modelos, alterna entre eles no meio da tarefa e paga a tarifa do provedor do modelo sem acréscimo. Não são necessárias chaves de API para começar.

### Instalação

Escolha onde você quer executar o Accure.

<details open>
<summary><strong>VS Code</strong></summary>

<br>

Instale a [extensão Accure Code](vscode:extension/accurecode.accure-code) diretamente ou baixe pelo [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=accurecode.Accure-Code). Crie uma conta e você terá acesso a mais de 500 modelos, incluindo GPT-5.5, Claude Opus 4.7, Claude Sonnet 4.6 e Gemini 3.1 Pro Preview, todos com preço do provedor.

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

Depois execute `accure` em qualquer diretório de projeto para começar.

</details>

<details>
<summary><strong>JetBrains</strong></summary>

<br>

Instale o [plugin Accure Code](https://plugins.jetbrains.com/plugin/28350-accure-code) pelo JetBrains Marketplace ou procure por "Accure Code" em `Settings → Plugins` dentro de qualquer IDE JetBrains.

</details>

<details>
<summary><strong>Cloud Agent</strong></summary>

<br>

Execute o Accure pela web, sem máquina local, em [app.accure.ai/cloud](https://app.accure.ai/cloud).

</details>

<details>
<summary><strong>Revisões de código</strong></summary>

<br>

Configure revisões automáticas de código com IA nos seus pull requests em [app.accure.ai/code-reviews](https://app.accure.ai/code-reviews).

</details>

<details>
<summary><strong>AccureClaw</strong></summary>

<br>

Inicie seu agente de IA sempre ativo em [app.accure.ai/claw](https://app.accure.ai/claw).

</details>

<details>
<summary>Instalar a CLI pelo GitHub Releases (binários)</summary>

Baixe o binário mais recente na [página de Releases](https://github.com/Accure-Org/accurecode/releases).

| Plataforma | Asset |
|---|---|
| Windows (a maioria dos PCs) | `accure-windows-x64.zip` |
| macOS (Apple Silicon) | `accure-darwin-arm64.zip` |
| macOS (Intel) | `accure-darwin-x64.zip` |
| Linux x64 | `accure-linux-x64.tar.gz` |
| Linux ARM | `accure-linux-arm64.tar.gz` |

Notas: `x64-baseline` é uma build de compatibilidade para CPUs antigas sem AVX. `musl` é a build com link estático para Alpine ou imagens Docker mínimas sem glibc. `accure-vscode-*.vsix` é o pacote da extensão VS Code, não a CLI. Arquivos `Source code` são para compilar a partir do código-fonte.

</details>

### Agents

Accure vem com agents especializados para você alternar dependendo da tarefa. Você também pode criar seus próprios agents personalizados.

- **Code** - O padrão. Implementa e edita código a partir de linguagem natural.
- **Plan** - Desenha a arquitetura e escreve planos de implementação antes de qualquer código ser escrito.
- **Ask** - Responde perguntas sobre sua base de código sem tocar nos arquivos.
- **Debug** - Soluciona e rastreia problemas.
- **Review** - Revisa suas mudanças e aponta problemas de performance, segurança, estilo e cobertura de testes.

Saiba mais sobre [agents e agents personalizados](https://accure.ai/docs/code-with-ai/agents/using-agents).

### O que ele faz

- **Geração de código** a partir de linguagem natural, em vários arquivos.
- **Autocomplete inline** com sugestões ghost-text e Tab para aceitar.
- **Autoverificação** para que o agente revise e corrija o próprio trabalho.
- **Controle de terminal e navegador** para executar comandos e automatizar a web.
- **Marketplace MCP** para encontrar e conectar servidores MCP que ampliam o que o agente pode fazer.
- **Mais de 500 modelos** com alternância no meio da tarefa, para combinar latência, custo e raciocínio com o trabalho.

### Modo autônomo (CI/CD)

Execute `accure run` com `--auto` para operação totalmente autônoma e sem prompts, criada para pipelines CI/CD:

```bash
accure run --auto "run tests and fix any failures"
```

`--auto` desativa todos os prompts de permissão e permite que o agente execute qualquer ação sem confirmação. Use apenas em ambientes confiáveis.

### Documentação

Para configuração e todo o resto, consulte a [documentação](https://accure.ai/docs).

### Contribuindo

Contribuições são bem-vindas de desenvolvedores, escritores e qualquer pessoa. Comece pelo [Contributing Guide](/CONTRIBUTING.md) para configurar o ambiente, conhecer os padrões de código e abrir um pull request. Consulte [RELEASING.md](RELEASING.md) para o processo de release da extensão VS Code e da CLI, e [packages/accure-jetbrains/RELEASING.md](packages/accure-jetbrains/RELEASING.md) para o plugin JetBrains.

Leia nosso [Code of Conduct](/CODE_OF_CONDUCT.md) antes de participar.

### Licença

MIT. Você pode usar, modificar e distribuir este código, inclusive comercialmente, desde que mantenha os avisos de atribuição e licença. Consulte [License](/LICENSE).

### FAQ

<details>
<summary>De onde veio o Accure CLI?</summary>

Accure CLI é um fork do [OpenCode](https://github.com/Accure-Org/accurecode), aprimorado para funcionar dentro da plataforma de engenharia agêntica da Accure.

</details>

---

**Participe da comunidade** [Discord](https://accure.ai/discord) | [X](https://x.com/accurecode) | [Reddit](https://www.reddit.com/r/accurecode/)
