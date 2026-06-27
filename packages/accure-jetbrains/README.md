# Accure JetBrains

AI coding agent plugin for JetBrains IDEs.

To try the v7 Early Access Program plugin, follow the [JetBrains EAP installation guide](https://accure.ai/docs/code-with-ai/platforms/jetbrains#jetbrains-early-access).

---

## Set up your environment

### Prerequisites

- **Bun** -- used to build CLI binaries and run build scripts
- **JDK 21+** -- required by Gradle and the IntelliJ Platform SDK. Check with `java -version`. The preferred way to install is via [SDKMAN](https://sdkman.io/install):

  ```bash
  # Install SDKMAN (if not already installed)
  curl -s "https://get.sdkman.io" | bash

  # Install and activate Java 21 (Eclipse Temurin)
  sdk install java 21-tem
  sdk use java 21-tem
  ```

- **IntelliJ IDEA** -- to run the plugin in a sandboxed IDE

---

## Fresh worktree setup

When working in a git worktree (e.g. via the Agent Manager), run `bun install` from the repo root before building or running Gradle tasks:

```bash
bun install
```

This installs Node dependencies required by the build scripts, including `script/build.ts` which prepares CLI binaries.

---

## Open in IntelliJ

When you open the monorepo root in IntelliJ IDEA, the Gradle project at `packages/accure-jetbrains/` should be auto-detected via `.idea/gradle.xml`. If not, link it manually: **File > Settings > Build Tools > Gradle > +** and select `packages/accure-jetbrains/settings.gradle.kts`.

---

## Build locally

From `packages/accure-jetbrains/`:

```
bun run build
```

This builds the CLI binary for your current OS/arch only, copies it into the backend module resources, and runs `./gradlew buildPlugin`. The plugin archive is output to `build/distributions/`.

Or via Turbo from the repo root:

```
bun turbo build --filter=@accurecode/accure-jetbrains
```

---

## Build for production

From `packages/accure-jetbrains/`:

```
bun run build:production
```

This builds CLI binaries for all 6 desktop platforms (darwin-arm64, darwin-x64, linux-arm64, linux-x64, windows-x64, windows-arm64), copies them all into the backend jar, and fails if any are missing. Gradle also validates all platforms are present via `-Pproduction=true`.

The built plugin archive is at `build/distributions/accurecode.jetbrains-<version>.zip`. This zip can be installed in any JetBrains IDE via **Settings > Plugins > Install Plugin from Disk**.

---

## Releasing

See [RELEASING.md](RELEASING.md) for the full release process, including how to tag and push an RC, where to watch workflow progress, and how to install RC builds via the custom plugin repository.

---

## Run the plugin

Use the `runIde` Gradle task (available in the Gradle tool window or via `./gradlew runIde` from `packages/accure-jetbrains/`) to launch a sandboxed IntelliJ instance with the plugin installed.

`runIde` does not prepare the CLI binary automatically. Run `bun run build --prepare-cli` from `packages/accure-jetbrains/` first to copy the local-platform binary into `backend/build/generated/cli/cli/`.

Production packaging still requires running `bun run build:production` so all platform binaries are present.

### Run the split backend

Use the checked-in `Run IDE (Backend)` run configuration (or `./gradlew runIdeBackend`) to launch just the backend half of a split-mode session. It prepares the local-platform CLI binary automatically when `backend/build/generated/cli/cli/` does not contain the expected binary.

If `Run IDE (Backend)` exits shortly after startup, check for an orphaned Java process from a previous backend run and kill it before restarting the backend.

Use `Run IDE (Split Mode)` to launch both halves at once (composes `Run IDE (Backend)` + `Run IDE (Frontend)`).

### Backend Gradle properties

All properties below are passed with `-P` on the Gradle command line or in the run configuration's script parameters field.

| Property | Default | Description |
|---|---|---|
| `accurecode.splitModeServerPort` | random high port | Backend split-mode server port. `0` or omitted picks a random port from 49152-65535. |
| `accurecode.dev.storage.isolated` | `false` | When `true`, CLI runs with `XDG_*_HOME` pointing to `.accurecode-dev/` in the worktree root, fully isolating dev storage from your real Accure installation. Enabled by default in `Run IDE (Backend)`. |
| `accurecode.dev.worktree.root` | monorepo root | Worktree root used to resolve `.accurecode-dev/`. Auto-detected from the Gradle project directory; override only when the auto-detection is wrong. |
| `accure.bun.path` | `bun` on `$PATH` | Absolute path to Bun. Set this when IntelliJ-launched Gradle cannot find Bun automatically. |

Example with a fixed split-mode port:

```text
-Paccure.dev.log.level=debug -Paccure.splitModeServerPort=12345
```

### Dev storage isolation

When `accurecode.dev.storage.isolated=true`, the CLI subprocess receives standard `XDG_*_HOME` env vars pointing under `.accurecode-dev/` in the worktree root:

```
.accurecode-dev/
  data/    -> XDG_DATA_HOME   (CLI uses .../data/accure for sessions, logs, ...)
  config/  -> XDG_CONFIG_HOME (CLI uses .../config/accure for global config)
  state/   -> XDG_STATE_HOME  (CLI uses .../state/accure for state)
  cache/   -> XDG_CACHE_HOME  (CLI uses .../cache/accure for cache, bin)
```

This keeps all development data isolated from your real Accure installation. The `.accurecode-dev/` directory is gitignored and created automatically on first run.

The `Run IDE (Backend)` run configuration enables this by default. To disable it:

```text
-Paccure.dev.storage.isolated=false
```

---

### Debug logging properties

The plugin supports a few JVM system properties for local debugging. These are most useful with `runIde` in sandbox mode because the logs are mirrored to `accure-dev.log` files for frontend and backend.

`accurecode.dev.log.level`

- Controls the Accure debug file logger level.
- Supported values: `DEBUG`, `INFO`, `WARN`, `ERROR`, `OFF`
- Default: `INFO`
- Use `DEBUG` to enable detailed chat tracing and lazy `log.debug { ... }` summaries.

`accurecode.dev.log.chat.content`

- Controls how much chat text content appears in structured chat logs.
- Supported values:
  - `off`: no text previews, metadata only
  - `preview`: sanitized truncated previews
  - `full`: sanitized full content
- Default: `off`

`accurecode.dev.log.chat.preview.max`

- Maximum preview size when `accurecode.dev.log.chat.content=preview`
- Default: `160`

Where to find the log files:

- In sandbox `runIde` runs, Accure writes separate dev log files for each side under the IDE sandbox log directory reported by `PathManager.getLogDir()`.
- Frontend log file: `<sandbox log dir>/accure-frontend/accure-dev.log`
- Backend log file: `<sandbox log dir>/accure-backend/accure-dev.log`
- In practice these sit under the current `log_run*` sandbox logs for the active run.
- If you are unsure of the exact sandbox root, open the IDE log directory from the running sandbox instance and then look for the `accure-frontend/` and `accure-backend/` subdirectories.

Recommended combinations:

```text
-Daccure.dev.log.level=DEBUG -Daccure.dev.log.chat.content=off
```

```text
-Daccure.dev.log.level=DEBUG -Daccure.dev.log.chat.content=preview -Daccure.dev.log.chat.preview.max=120
```

Use `off` first. Switch to `preview` only when you need prompt or tool payload hints to diagnose a problem. Use `full` only for short local reproductions because logs can grow quickly.

---

## Run Gradle directly

For direct local packaging, run:

```bash
bun run build
```

This prepares the local CLI binary and then runs `./gradlew buildPlugin`.

If you run `./gradlew buildPlugin` directly, Gradle verifies CLI binaries are present but does not build them first. Run `bun run build --prepare-cli` beforehand if the binaries are missing.

For production verification:

```
./gradlew buildPlugin -Pproduction=true
```
