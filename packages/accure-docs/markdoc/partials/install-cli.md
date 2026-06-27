Use Accure Code directly from your terminal for maximum flexibility.

### Install via npm

```bash
npm install -g @accurecode/cli
```

### Older CPUs (No AVX Support)

If you're running on an older CPU without AVX support (e.g., Intel Xeon Nehalem, AMD Bulldozer, or older), the CLI may crash with "Illegal instruction". In that case, download the **baseline** variant from GitHub releases:

1. Go to [Accure Releases](https://github.com/Accure-Inc/accure-code/releases)
2. Download the `-baseline` variant for your platform:
   - Linux x64: `accure-linux-x64-baseline.tar.gz`
   - macOS x64: `accure-darwin-x64-baseline.zip`
   - Windows x64: `accure-windows-x64-baseline.zip`
3. Extract and run the `accure` binary directly

### Verify Installation

```bash
accure --version
```
