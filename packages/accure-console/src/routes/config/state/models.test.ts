import { describe, expect, test } from "bun:test"
import { hasGateway, visible } from "./privacy"

describe("model privacy filter", () => {
  test("detects when Accure Gateway models are present", () => {
    expect(hasGateway([{ id: "accure" }, { id: "openai" }])).toBe(true)
    expect(hasGateway([{ id: "openai" }])).toBe(false)
  })

  test("shows every model when disabled", () => {
    expect(visible({ id: "accure" }, { mayTrainOnYourPrompts: true }, false)).toBe(true)
  })

  test("hides only Accure Gateway models explicitly marked for prompt training", () => {
    expect(visible({ id: "accure" }, { mayTrainOnYourPrompts: true }, true)).toBe(false)
    expect(visible({ id: "accure" }, { mayTrainOnYourPrompts: false }, true)).toBe(true)
    expect(visible({ id: "accure" }, {}, true)).toBe(true)
    expect(visible({ id: "openai" }, { mayTrainOnYourPrompts: true }, true)).toBe(true)
  })
})
