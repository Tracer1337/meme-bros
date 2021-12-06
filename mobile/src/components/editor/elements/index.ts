import React from "react"
import { CanvasElement, PickElement } from "../../../types"
import Image, { imageDefaultData } from "./Image"
import Shape, { shapeDefaultData } from "./Shape"
import Textbox, { textboxDefaultData } from "./Textbox"

const elementsMap: Record<
    CanvasElement["type"],
    React.ComponentType<any>
> = {
    "textbox": Textbox,
    "image": Image,
    "shape": Shape,
}

const defaultDataMap: Record<CanvasElement["type"], any> = {
    "textbox": textboxDefaultData,
    "image": imageDefaultData,
    "shape": shapeDefaultData
}

export function getElementByType<T extends CanvasElement["type"]>(
    type: T
): React.ComponentType<{ element: PickElement<T> }> {
    return elementsMap[type]
}

export function getDefaultDataByType<T extends CanvasElement["type"]>(
    type: T
): PickElement<T>["data"] {
    return defaultDataMap[type]
}

getDefaultDataByType("shape")
