import type { AccureClient } from "@accurecode/sdk/v2/client"

export async function hasGit(client: AccureClient, directory: string): Promise<boolean> {
  return client.project
    .current({ directory })
    .then((r) => r.data?.vcs === "git")
    .catch(() => false)
}
