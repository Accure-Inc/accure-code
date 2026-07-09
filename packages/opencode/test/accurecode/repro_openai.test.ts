import { describe, it, expect } from "bun:test"
import { Effect, Layer } from "effect"
import { testEffect } from "../lib/effect"
import { Provider } from "@/provider/provider"
import { ProviderID, ModelID } from "@/provider/schema"
import { ToolRegistry } from "@/tool/registry"
import { Plugin } from "@/plugin"
import { Question } from "@/question"
import { Todo } from "@/session/todo"
import { Skill } from "@/skill"
import { Agent } from "@/agent/agent"
import { Session } from "@/session/session"
import { SessionStatus } from "@/session/status"
import { BackgroundJob } from "@/background/job"
import { Git } from "@/git"
import { LSP } from "@/lsp/lsp"
import { Instruction } from "@/session/instruction"
import { AppFileSystem } from "@opencode-ai/core/filesystem"
import { Bus } from "@/bus"
import { FetchHttpClient } from "effect/unstable/http"
import { Format } from "@/format"
import { Ripgrep } from "@/file/ripgrep"
import * as Truncate from "@/tool/truncate"
import { Command } from "@/command"
import { RuntimeFlags } from "@/effect/runtime-flags"
import { CrossSpawnSpawner } from "@opencode-ai/core/cross-spawn-spawner"
import { RepositoryCache } from "@/reference/repository-cache"
import { Reference } from "@/reference/reference"
import { Config } from "@/config/config"
import { Global } from "@opencode-ai/core/global"
import * as Log from "@opencode-ai/core/util/log"
import fs from "fs"
import path from "path"

Log.init({ print: false })

const node = CrossSpawnSpawner.defaultLayer

const registryLayer = () =>
  ToolRegistry.layer
    .pipe(
      Layer.provide(Config.defaultLayer),
      Layer.provide(Plugin.defaultLayer),
      Layer.provide(Question.defaultLayer),
      Layer.provide(Todo.defaultLayer),
      Layer.provide(Skill.defaultLayer),
      Layer.provide(Agent.defaultLayer),
      Layer.provide(Session.defaultLayer),
      Layer.provide(Layer.mergeAll(SessionStatus.defaultLayer, BackgroundJob.defaultLayer)),
      Layer.provide(Provider.defaultLayer),
      Layer.provide(Layer.mergeAll(Git.defaultLayer, RepositoryCache.defaultLayer)),
      Layer.provide(Reference.defaultLayer),
      Layer.provide(LSP.defaultLayer),
      Layer.provide(Instruction.defaultLayer),
      Layer.provide(AppFileSystem.defaultLayer),
      Layer.provide(Bus.layer),
      Layer.provide(FetchHttpClient.layer),
      Layer.provide(Format.defaultLayer),
      Layer.provide(node),
      Layer.provide(Ripgrep.defaultLayer),
      Layer.provide(Truncate.defaultLayer),
    )
    .pipe(
      Layer.provide(RuntimeFlags.layer({})),
      Layer.provide(Command.defaultLayer),
    )

const testIt = testEffect(Layer.mergeAll(registryLayer(), Provider.defaultLayer, Config.defaultLayer, node, Agent.defaultLayer))

describe("provider resolve verification", () => {
  testIt.instance("resolves accure-models with correct URL and headers from dynamically written test config", () =>
    Effect.gen(function* () {
      // Setup temporary directories
      const configDir = Global.Path.config
      const dataDir = Global.Path.data
      
      fs.mkdirSync(configDir, { recursive: true })
      fs.mkdirSync(dataDir, { recursive: true })
      
      // Write test configuration
      const testConfig = {
        provider: {
          "accure-models": {
            options: {
              baseURL: "https://atm.accure.ai/v1",
              providerType: "vllm",
              "atm-4-modelId": "accureai/atm-v4"
            }
          }
        }
      }
      fs.writeFileSync(path.join(configDir, "accure.jsonc"), JSON.stringify(testConfig, null, 2))
      
      // Write test authentication credentials
      const testAuth = {
        "accure-models": {
          type: "api",
          key: "my-custom-verification-token"
        }
      }
      fs.writeFileSync(path.join(dataDir, "auth.json"), JSON.stringify(testAuth, null, 2))
      
      const providerService = yield* Provider.Service
      
      // Force reload config/auth to pick up the newly written files
      const configService = yield* Config.Service
      yield* configService.invalidate()
      
      const model = yield* providerService.getModel(ProviderID.make("accure-models"), ModelID.make("atm-4"))
      const language: any = yield* providerService.getLanguage(model)
      
      const resolvedUrl = language.config.url({ path: "/chat/completions" })
      const headers = language.config.headers()
      
      console.log("\n=================== VERIFICATION RESULTS ===================")
      console.log("Resolved Target URL :", resolvedUrl)
      console.log("Authorization Header:", headers.authorization ? "Bearer " + headers.authorization.slice(7, 25) + "..." : "None")
      console.log("============================================================\n")

      expect(resolvedUrl).toBe("https://atm.accure.ai/v1/chat/completions")
      expect(headers.authorization).toBe("Bearer my-custom-verification-token")
      
      // Cleanup
      try {
        fs.unlinkSync(path.join(configDir, "accure.jsonc"))
        fs.unlinkSync(path.join(dataDir, "auth.json"))
      } catch {}
    })
  )
})
