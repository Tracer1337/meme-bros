import { Editor } from "@meme-bros/shared"
import React from "react"
import Image from "./Image"
import { ElementComponentProps } from "./makeElement"
import Shape from "./Shape"
import Textbox from "./Textbox"

const elementsMap: Record<
    Editor.CanvasElement["type"],
    React.ComponentType<any>
> = {
    "textbox": Textbox,
    "image": Image,
    "shape": Shape,
}
export function getElementByType<T extends Editor.CanvasElement["type"]>(
    type: T
): React.ComponentType<ElementComponentProps<T>> {
    return elementsMap[type]
}
