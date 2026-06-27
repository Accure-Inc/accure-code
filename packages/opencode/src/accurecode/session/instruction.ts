import { AccurecodeMarkdown } from "../config/markdown"

export namespace AccurecodeInstruction {
  export function content(text: string, item: string) {
    return AccurecodeMarkdown.substitute(text, item)
  }
}
