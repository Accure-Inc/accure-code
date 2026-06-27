<p align="center">
  <a href="README.md">English</a> | <a href="README.zh.md">简体中文</a> | <a href="README.zht.md">繁體中文</a> | <a href="README.ko.md">한국어</a> | <a href="README.de.md">Deutsch</a> | Español | <a href="README.fr.md">Français</a> | <a href="README.it.md">Italiano</a> | <a href="README.da.md">Dansk</a> | <a href="README.ja.md">日本語</a> | <a href="README.pl.md">Polski</a> | <a href="README.ru.md">Русский</a> | <a href="README.bs.md">Bosanski</a> | <a href="README.ar.md">العربية</a> | <a href="README.no.md">Norsk</a> | <a href="README.br.md">Português (Brasil)</a> | <a href="README.th.md">ไทย</a> | <a href="README.tr.md">Türkçe</a> | <a href="README.uk.md">Українська</a> | <a href="README.bn.md">বাংলা</a> | <a href="README.gr.md">Ελληνικά</a> | <a href="README.vi.md">Tiếng Việt</a>
</p>

<p align="center">
  <a href="https://accure.ai"><img width="250" alt="Accure Code logo" src="logo.png" /></a>
</p>

<p align="center">El agente de programación de código abierto para construir con IA en VS Code, JetBrains o la CLI.</p>

![Accure-in-VS-Code-and-CLI](screenshot.png)

---

Accure Code es un agente de programación con IA que te acompaña en todos los lugares donde trabajas: [VS Code](https://accure.ai/landing/vs-code), [JetBrains](https://accure.ai/features/jetbrains-native) y la [CLI](https://accure.ai/cli). Es de código abierto y tiene precios abiertos. Puedes elegir entre más de 500 modelos, cambiar entre ellos a mitad de una tarea y pagar la tarifa del proveedor del modelo sin recargos. No necesitas claves de API para empezar.

### Instalación

Elige dónde quieres ejecutar Accure.

<details open>
<summary><strong>VS Code</strong></summary>

<br>

Instala directamente la [extensión Accure Code](vscode:extension/accurecode.accure-code), o descárgala desde [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=accurecode.Accure-Code). Crea una cuenta y tendrás acceso a más de 500 modelos, incluidos GPT-5.5, Claude Opus 4.7, Claude Sonnet 4.6 y Gemini 3.1 Pro Preview, todos con precios del proveedor.

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

Luego ejecuta `accure` en cualquier directorio de proyecto para empezar.

</details>

### Agents

Accure incluye agents especializados entre los que puedes cambiar según la tarea. También puedes crear tus propios agents personalizados.

- **Code** - El predeterminado. Implementa y edita código a partir de lenguaje natural.
- **Plan** - Diseña la arquitectura y escribe planes de implementación antes de que se escriba código.
- **Ask** - Responde preguntas sobre tu base de código sin tocar archivos.
- **Debug** - Diagnostica y rastrea problemas.
- **Review** - Revisa tus cambios y detecta problemas de rendimiento, seguridad, estilo y cobertura de pruebas.

Más información sobre [agents y agents personalizados](https://accure.ai/docs/code-with-ai/agents/using-agents).

### Qué hace

- **Generación de código** desde lenguaje natural, en varios archivos.
- **Autocompletado en línea** con sugerencias ghost-text y Tab para aceptar.
- **Autoverificación** para que el agente revise y corrija su propio trabajo.
- **Control de terminal y navegador** para ejecutar comandos y automatizar la web.
- **Marketplace MCP** para encontrar y conectar servidores MCP que amplían lo que el agente puede hacer.
- **Más de 500 modelos** con cambio a mitad de tarea, para ajustar latencia, costo y razonamiento al trabajo.

### Modo autónomo (CI/CD)

Ejecuta `accure run` con `--auto` para operar de forma totalmente autónoma y sin prompts, pensado para pipelines CI/CD:

```bash
accure run --auto "run tests and fix any failures"
```

`--auto` desactiva todos los prompts de permisos y permite que el agente ejecute cualquier acción sin confirmación. Úsalo solo en entornos de confianza.

### Documentación

Para configuración y todo lo demás, consulta la [documentación](https://accure.ai/docs).

### Contribuir

Las contribuciones de desarrolladores, escritores y cualquier persona son bienvenidas. Empieza con la [Guía de contribución](/CONTRIBUTING.md) para la configuración del entorno, los estándares de código y cómo abrir un pull request. Consulta [RELEASING.md](RELEASING.md) para el proceso de lanzamiento de la extensión de VS Code y la CLI, y [packages/accure-jetbrains/RELEASING.md](packages/accure-jetbrains/RELEASING.md) para el plugin de JetBrains.

Lee nuestro [Código de conducta](/CODE_OF_CONDUCT.md) antes de participar.

### Licencia

MIT. Puedes usar, modificar y distribuir este código, incluso comercialmente, siempre que conserves los avisos de atribución y licencia. Consulta [License](/LICENSE).

### FAQ

<details>
<summary>¿De dónde viene Accure CLI?</summary>

Accure CLI es un fork de [OpenCode](https://github.com/Accure-Org/accurecode), mejorado para funcionar dentro de la plataforma de ingeniería agéntica de Accure.

</details>

---

**Únete a la comunidad** [Discord](https://accure.ai/discord) | [X](https://x.com/accurecode) | [Reddit](https://www.reddit.com/r/accurecode/)
