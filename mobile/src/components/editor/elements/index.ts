import React from "react"
import { Text } from "react-native-paper"
import { CanvasElement, PickElement } from "../../../types"
import Image, { imageDefaultData } from "./Image"
import Textbox, { textboxDefaultData } from "./Textbox"

function NotImplemented() {
    return React.createElement(Text, null, "Not Implemented")
}

const elementsMap: Record<
    CanvasElement["type"],
    React.ComponentType<{ element: any }>
> = {
    "textbox": Textbox,
    "image": Image,
    "shape": NotImplemented,
}

const defaultDataMap: Record<CanvasElement["type"], any> = {
    "textbox": textboxDefaultData,
    "image": imageDefaultData,
    "shape": {}
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
