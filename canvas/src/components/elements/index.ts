import React from "react"
import { Editor } from "@meme-bros/shared"
import Image, { getImageDefaultData } from "./Image"
import Shape, { getShapeDefaultData } from "./Shape"
import Textbox, { getTextboxDefaultData } from "./Textbox"

const elementsMap: Record<
    Editor.CanvasElement["type"],
    React.ComponentType<any>
> = {
    "textbox": Textbox,
    "image": Image,
    "shape": Shape,
}

const defaultDataMap: Record<Editor.CanvasElement["type"], () => any> = {
    "textbox": getTextboxDefaultData,
    "image": getImageDefaultData,
    "shape": getShapeDefaultData
}

export function getElementByType<T extends Editor.CanvasElement["type"]>(
    type: T
): React.ComponentType<{ element: Editor.PickElement<T> }> {
    return elementsMap[type]
}

export function getDefaultDataByType<T extends Editor.CanvasElement["type"]>(
    type: T
): Editor.PickElement<T>["data"] {
    return defaultDataMap[type]()
}
