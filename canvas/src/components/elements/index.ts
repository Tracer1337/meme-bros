import React from "react"
import * as Core from "@meme-bros/core"
import Image, { getImageDefaultData } from "./Image"
import Shape, { getShapeDefaultData } from "./Shape"
import Textbox, { getTextboxDefaultData } from "./Textbox"

const elementsMap: Record<
    Core.CanvasElement["type"],
    React.ComponentType<any>
> = {
    "textbox": Textbox,
    "image": Image,
    "shape": Shape,
}

const defaultDataMap: Record<Core.CanvasElement["type"], () => any> = {
    "textbox": getTextboxDefaultData,
    "image": getImageDefaultData,
    "shape": getShapeDefaultData
}

export function getElementByType<T extends Core.CanvasElement["type"]>(
    type: T
): React.ComponentType<{ element: Core.PickElement<T> }> {
    return elementsMap[type]
}

export function getDefaultDataByType<T extends Core.CanvasElement["type"]>(
    type: T
): Core.PickElement<T>["data"] {
    return defaultDataMap[type]()
}

getDefaultDataByType("shape")
