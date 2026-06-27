import React from "react"
import { Icon } from "./Icon"

interface AccureCodeIconProps {
  size?: string
}

export function AccureCodeIcon({ size = "1.2em" }: AccureCodeIconProps) {
  return (
    <Icon src="/docs/img/accure-v1.svg" srcDark="/docs/img/accure-v1-white.svg" alt="Accure Code Icon" size={size} />
  )
}
