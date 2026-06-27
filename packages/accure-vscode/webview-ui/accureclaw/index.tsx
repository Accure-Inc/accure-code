// AccureClaw SolidJS webview entry point

import { render } from "solid-js/web"
import "@accurecode/accure-ui/styles"
import "./accureclaw.css"
import { AccureClawApp } from "./AccureClawApp"

const root = document.getElementById("root")
if (root) {
  render(() => <AccureClawApp />, root)
}
