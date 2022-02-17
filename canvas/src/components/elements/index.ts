import { Editor } from "@meme-bros/shared"
import React from "react"
import { ElementComponentProps } from "./makeElement"
import ImageElement from "./ImageElement"
import PathElement from "./PathElement"
import ShapeElement from "./ShapeElement"
import TextboxElement from "./TextboxElement"

const elementsMap: Record<
    Editor.CanvasElement["type"],
    React.ComponentType<any>
> = {
    "textbox": TextboxElement,
    "image": ImageElement,
    "shape": ShapeElement,
    "path": PathElement
}

export function getElementByType<T extends Editor.CanvasElement["type"]>(
    type: T
): React.ComponentType<ElementComponentProps<T>> {
    return elementsMap[type]
}
