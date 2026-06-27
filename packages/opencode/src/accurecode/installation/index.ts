export const Npm = {
  name: "@accurecode/cli",
  path: "@accurecode%2fcli",
}

export const Brew = {
  name: "accure",
  tap: "Accure-Org/tap",
  formula: "Accure-Org/tap/accure",
  api: "https://formulae.brew.sh/api/formula/accure.json",
}

export const Choco = {
  name: "accure",
  api: "https://community.chocolatey.org/api/v2/Packages?$filter=Id%20eq%20%27accure%27%20and%20IsLatestVersion&$select=Version",
}

export const Scoop = {
  name: "accure",
  manifest: "https://raw.githubusercontent.com/ScoopInstaller/Main/master/bucket/accure.json",
}

export const Release = {
  api: "https://api.github.com/repos/Accure-Inc/accure-code/releases/latest",
  install: "https://accure.ai/install",
}
