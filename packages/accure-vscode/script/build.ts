#!/usr/bin/env bun
import { $ } from "bun"
import { join } from "node:path"
import { existsSync, mkdirSync, rmSync, chmodSync } from "node:fs"
import { copyTreeSitterResources } from "../src/services/cli-backend/cli-resources"
import { ensureFfmpegForTarget } from "./ffmpeg-helper"

const packageJsonPath = join(import.meta.dir, "..", "package.json")
const packageJson = await Bun.file(packageJsonPath).json()
const version = process.env.ACCURECODE_VERSION ? process.env.ACCURECODE_VERSION : packageJson.version
const prerelease = process.env.ACCURECODE_PRE_RELEASE === "true"

console.log(`Building VSCode extension version: ${version}${prerelease ? " (pre-release)" : ""}`)

if (packageJson.version !== version) {
  console.log(`Updating package.json version from ${packageJson.version} to ${version}`)
  packageJson.version = version
  await Bun.write(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n")
}

const cliDistDir = process.env.CLI_DIST_DIR || join(import.meta.dir, "..", "..", "opencode", "dist")
console.log(`Using CLI dist directory: ${cliDistDir}`)

if (!existsSync(cliDistDir)) {
  throw new Error(`CLI dist directory not found: ${cliDistDir}`)
}

const targetFilter = process.env.TARGETS ? process.env.TARGETS.split(",").map((t) => t.trim()) : undefined
const allTargets = [
  {
    target: "linux-x64",
    cliDir: existsSync(join(cliDistDir, "@accurecode/cli-linux-x64-baseline"))
      ? "@accurecode/cli-linux-x64-baseline"
      : "@accurecode/cli-linux-x64",
    binary: "accure",
  },
  { target: "linux-arm64", cliDir: "@accurecode/cli-linux-arm64", binary: "accure" },
  {
    target: "alpine-x64",
    cliDir: existsSync(join(cliDistDir, "@accurecode/cli-linux-x64-baseline-musl"))
      ? "@accurecode/cli-linux-x64-baseline-musl"
      : "@accurecode/cli-linux-x64-musl",
    binary: "accure",
  },
  { target: "alpine-arm64", cliDir: "@accurecode/cli-linux-arm64-musl", binary: "accure" },
  { target: "darwin-x64", cliDir: "@accurecode/cli-darwin-x64", binary: "accure" },
  { target: "darwin-arm64", cliDir: "@accurecode/cli-darwin-arm64", binary: "accure" },
  { target: "win32-x64", cliDir: "@accurecode/cli-windows-x64", binary: "accure.exe" },
  { target: "win32-arm64", cliDir: "@accurecode/cli-windows-arm64", binary: "accure.exe" },
]
const targets = allTargets.filter((t) => !targetFilter || targetFilter.includes(t.target))

const binDir = join(import.meta.dir, "..", "bin")
const distDir = join(import.meta.dir, "..", "dist")
const outDir = join(import.meta.dir, "..", "out")

console.log("\n🧹 Cleaning up directories...")
for (const dir of [binDir, distDir, outDir]) {
  if (existsSync(dir)) {
    rmSync(dir, { recursive: true, force: true })
    console.log(`  ✓ Cleaned ${dir}`)
  }
}

mkdirSync(outDir, { recursive: true })
mkdirSync(distDir, { recursive: true })

console.log("\n🔄 Rebuilding SDK types (ensures dist/ is in sync with server API)...")
await $`bun run --cwd ${join(import.meta.dir, "..", "..", "sdk", "js")} build`

console.log("\n📦 Compiling extension...")
const root = join(import.meta.dir, "..")
await $`bun run check-types`.cwd(root)
await $`bun run lint`.cwd(root)
await $`node ${join(root, "esbuild.js")} --production`.cwd(root)

for (const config of targets) {
  console.log(`\n🎯 Processing target: ${config.target}`)

  if (existsSync(binDir)) {
    rmSync(binDir, { recursive: true, force: true })
  }
  mkdirSync(binDir, { recursive: true })

  const sourceBinary = join(cliDistDir, config.cliDir, "bin", config.binary)
  const targetBinary = join(binDir, config.binary)

  if (!existsSync(sourceBinary)) {
    throw new Error(`CLI binary not found at ${sourceBinary}`)
  }

  console.log(`  📥 Copying binary from ${config.cliDir}/bin/${config.binary}...`)
  await $`cp ${sourceBinary} ${targetBinary}`
  await copyTreeSitterResources(sourceBinary, targetBinary)

  if (config.binary !== "accure.exe") {
    chmodSync(targetBinary, 0o755)
  }

  console.log(`  ✅ Binary ready at ${targetBinary}`)

  console.log("Adding bundled FFmpeg helper...")
  await ensureFfmpegForTarget(config.target, binDir)

  console.log(`  📦 Packaging .vsix for ${config.target}${prerelease ? " (pre-release)" : ""}...`)
  const vsixPath = join(outDir, `accure-vscode-${config.target}.vsix`)
  const args = ["--no-dependencies", "--skip-license", "--target", config.target, "-o", vsixPath]
  if (prerelease) args.push("--pre-release")
  const vsceBin = existsSync(join(import.meta.dir, "..", "node_modules", ".bin", "vsce"))
    ? join(import.meta.dir, "..", "node_modules", ".bin", "vsce")
    : "vsce"
  await $`${vsceBin} package ${args}`.cwd(root).env({
    ...process.env,
    npm_config_ignore_scripts: "true",
  })
  console.log(`  ✅ Created ${vsixPath}`)
}

console.log("\n✨ All VSIX packages built successfully!")
