import { AccureCodeIcon } from "../../components"

export const accureCodeIcon = {
  render: AccureCodeIcon,
  selfClosing: true,
  attributes: {
    size: {
      type: String,
      default: "1.2em",
      description: "Size of the icon (CSS height value)",
    },
  },
}
