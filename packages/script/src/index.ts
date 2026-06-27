import { $ } from "bun"
import semver from "semver"
import path from "path"

const rootPkgPath = path.resolve(import.meta.dir, "../../../package.json")
const rootPkg = await Bun.file(rootPkgPath).json()
const expectedBunVersion = rootPkg.packageManager?.split("@")[1]

if (!expectedBunVersion) {
  throw new Error("packageManager field not found in root package.json")
}

// relax version requirement
const expectedBunVersionRange = `^${expectedBunVersion}`

if (!semver.satisfies(process.versions.bun, expectedBunVersionRange)) {
  throw new Error(`This script requires bun@${expectedBunVersionRange}, but you are using bun@${process.versions.bun}`)
}
// accurecode_change start
const env = {
  ACCURECODE_CHANNEL: process.env["ACCURECODE_CHANNEL"],
  ACCURECODE_BUMP: process.env["ACCURECODE_BUMP"],
  ACCURECODE_VERSION: process.env["ACCURECODE_VERSION"],
  ACCURECODE_RELEASE: process.env["ACCURECODE_RELEASE"],
  ACCURECODE_PRE_RELEASE: process.env["ACCURECODE_PRE_RELEASE"],
}
// accurecode_change end
const CHANNEL = await (async () => {
  if (env.ACCURECODE_CHANNEL) return env.ACCURECODE_CHANNEL // accurecode_change
  // accurecode_change start - publish to "rc" channel for pre-releases
  if (env.ACCURECODE_PRE_RELEASE === "true") return "rc"
  // accurecode_change end
  if (env.ACCURECODE_BUMP) return "latest" // accurecode_change
  if (env.ACCURECODE_VERSION && !env.ACCURECODE_VERSION.startsWith("0.0.0-")) return "latest" // accurecode_change
  return await $`git branch --show-current`.text().then((x) => x.trim().replace(/[^0-9A-Za-z-]/g, "-")) // accurecode_change
})()
const IS_PREVIEW = CHANNEL !== "latest"

// accurecode_change start - shared helpers for version computation
function parseVersion(input: string) {
  const match = input.trim().match(/^v?(\d+)\.(\d+)\.(\d+)$/)
  if (!match) return
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
    value: `${match[1]}.${match[2]}.${match[3]}`,
  }
}

function compareVersion(
  a: NonNullable<ReturnType<typeof parseVersion>>,
  b: NonNullable<ReturnType<typeof parseVersion>>,
) {
  if (a.major !== b.major) return a.major - b.major
  if (a.minor !== b.minor) return a.minor - b.minor
  return a.patch - b.patch
}

async function fetchLatest() {
  const data: any = await fetch("https://registry.npmjs.org/@accurecode/cli/latest").then((res) => {
    if (!res.ok) throw new Error(res.statusText)
    return res.json()
  })
  return data.version as string
}

async function fetchHighest() {
  if (!process.env.GH_REPO) return fetchLatest()
  const data: { tagName: string }[] = await $`gh release list --json tagName --limit 100 --repo ${process.env.GH_REPO}`
    .json()
    .catch(() => [])
  const versions = data.flatMap((item) => {
    const version = parseVersion(item.tagName)
    if (!version) return []
    return [version]
  })
  const highest = versions.sort(compareVersion).at(-1)
  if (highest) return highest.value
  return fetchLatest()
}

function bumpVersion(current: string, type: string) {
  const version = parseVersion(current)
  if (!version) throw new Error(`Invalid version: ${current}`)
  if (type === "major") return `${version.major + 1}.0.0`
  if (type === "minor") return `${version.major}.${version.minor + 1}.0`
  return `${version.major}.${version.minor}.${version.patch + 1}`
}
// accurecode_change end

const VERSION = await (async () => {
  if (env.ACCURECODE_VERSION) return env.ACCURECODE_VERSION
  if (IS_PREVIEW) {
    // accurecode_change start - rc releases use plain semver required by VS Code Marketplace
    if (env.ACCURECODE_BUMP && env.ACCURECODE_PRE_RELEASE === "true") {
      const current = await fetchHighest()
      return bumpVersion(current, env.ACCURECODE_BUMP.toLowerCase())
    }
    // accurecode_change end
    return `0.0.0-${CHANNEL}-${new Date().toISOString().slice(0, 16).replace(/[-:T]/g, "")}`
  }
  const version = await fetchHighest() // accurecode_change
  return bumpVersion(version, env.ACCURECODE_BUMP?.toLowerCase() ?? "patch") // accurecode_change
})()

// accurecode_change start
const team = [
  "actions-user",
  "accure-maintainer[bot]",
  "accureconnect[bot]",
  "accureconnect-lite[bot]",
  "alexkgold",
  "arimesser",
  "arkadiykondrashov",
  "bturcotte520",
  "catrielmuller",
  "chrarnoldus",
  "codingelves",
  "darkogj",
  "dependabot[bot]",
  "dosire",
  "DScdng",
  "emilieschario",
  "eshurakov",
  "Helix-Accure",
  "iscekic",
  "jeanduplessis",
  "jobrietbergen",
  "jrf0110",
  "johnnyeric",
  "alex-alecu",
  "imanolmzd-svg",
  "accurecode-bot",
  "accure-code-bot",
  "accure-code-bot[bot]",
  "kirillk",
  "lambertjosh",
  "LigiaZ",
  "marius-accurecode",
  "markijbema",
  "olearycrew",
  "pandemicsyn",
  "pedroheyerdahl",
  "RSO",
  "sbreitenother",
  "suhailkc2025",
  "Sureshkumars",
]
// accurecode_change end

export const Script = {
  get channel() {
    return CHANNEL
  },
  get version() {
    return VERSION
  },
  get preview() {
    return IS_PREVIEW
  },
  get release(): boolean {
    return !!env.ACCURECODE_RELEASE
  },
  get team() {
    return team
  },
}
console.log(`accure script`, JSON.stringify(Script, null, 2)) // accurecode_change
