declare global {
  const ACCURECODE_VERSION: string
  const ACCURECODE_CHANNEL: string
  const ACCURECODE_BUILD_KIND: string // accurecode_change
}

export const InstallationVersion = typeof ACCURECODE_VERSION === "string" ? ACCURECODE_VERSION : "local"
export const InstallationChannel = typeof ACCURECODE_CHANNEL === "string" ? ACCURECODE_CHANNEL : "local"
export const InstallationLocal = InstallationChannel === "local"
// accurecode_change start - distinguish release builds from source / local builds
export const InstallationBuildKind: "source" | "release" =
  typeof ACCURECODE_BUILD_KIND === "string" && ACCURECODE_BUILD_KIND === "release" ? "release" : "source"
// accurecode_change end
