import { expect } from "bun:test"
import { Effect, Layer } from "effect"
import { CrossSpawnSpawner } from "@opencode-ai/core/cross-spawn-spawner"
import path from "path"
import { Skill } from "../../src/skill"
import * as AccureSkill from "../../src/accurecode/skill-remove"
import { BUILTIN_SKILLS } from "../../src/accurecode/skills/builtin"
import { TestInstance } from "../fixture/fixture"
import { testEffect } from "../lib/effect"

const it = testEffect(Layer.mergeAll(Skill.defaultLayer, CrossSpawnSpawner.defaultLayer))

it.instance(
  "built-in skills are present in empty project",
  () =>
    Effect.gen(function* () {
      const skill = yield* Skill.Service
      const skills = yield* skill.all()
      for (const builtin of BUILTIN_SKILLS) {
        const found = skills.find((s) => s.name === builtin.name)
        expect(found).toBeDefined()
        expect(found!.location).toBe(Skill.BUILTIN_LOCATION)
        expect(found!.description).toBe(builtin.description)
        expect(found!.content.length).toBeGreaterThan(0)
      }
    }),
  { git: true },
)

it.instance(
  "built-in skill has correct metadata",
  () =>
    Effect.gen(function* () {
      const skill = yield* Skill.Service
      const item = yield* skill.get("accure-config")
      expect(item).toBeDefined()
      expect(item!.name).toBe("accure-config")
      expect(item!.location).toBe(Skill.BUILTIN_LOCATION)
      expect(item!.content).toContain("accure")
    }),
  { git: true },
)

it.instance(
  "accure-config is protected from removal",
  () =>
    Effect.gen(function* () {
      const skill = yield* Skill.Service
      const item = yield* skill.get("accure-config")
      expect(item).toBeDefined()
      expect(AccureSkill.builtin(item!.location)).toBe(true)
    }),
  { git: true },
)

it.instance(
  "user skill overrides built-in with same name",
  () =>
    Effect.gen(function* () {
      const instance = yield* TestInstance
      const dir = path.join(instance.directory, ".accurecode", "skill", "accure-config")
      yield* Effect.promise(() =>
        Bun.write(
          path.join(dir, "SKILL.md"),
          `---
name: accure-config
description: User override of accure-config.
---

# Custom accure-config

User-provided content.
`,
        ),
      )

      const skill = yield* Skill.Service
      const item = yield* skill.get("accure-config")
      expect(item).toBeDefined()
      expect(item!.description).toBe("User override of accure-config.")
      expect(item!.location).not.toBe(Skill.BUILTIN_LOCATION)
      expect(item!.location).toContain(path.join("skill", "accure-config", "SKILL.md"))
    }),
  { git: true },
)
