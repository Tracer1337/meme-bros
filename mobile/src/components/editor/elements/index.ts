import React from "react"
import Textbox, { TextboxData } from "./Textbox"

export type Element = {
    id: number,
    type: "textbox",
    data: TextboxData
}

const elementsMap: Record<Element["type"], React.ElementType> = {
    "textbox": Textbox
}

export function getElementByType(type: Element["type"]) {
    return elementsMap[type]
}
