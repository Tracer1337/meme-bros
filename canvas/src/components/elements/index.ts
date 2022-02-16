import { Editor } from "@meme-bros/shared"
import React from "react"
import { ElementComponentProps } from "./makeElement"
import Image from "./Image"
import Path from "./Path"
import Shape from "./Shape"
import Textbox from "./Textbox"

const elementsMap: Record<
    Editor.CanvasElement["type"],
    React.ComponentType<any>
> = {
    "textbox": Textbox,
    "image": Image,
    "shape": Shape,
    "path": Path
}

export function getElementByType<T extends Editor.CanvasElement["type"]>(
    type: T
): React.ComponentType<ElementComponentProps<T>> {
    return elementsMap[type]
}
