import React from "react"
import { ElementProps } from "./makeElement"
import Textbox, { TextboxData, textboxDefaultData } from "./Textbox"

type Rect = {
    x: number,
    y: number,
    width: number,
    height: number,
    rotation: number
}

export type ElementTypes = "textbox"

export type ElementSchema = {
    id: number,
    rect: Rect,
    type: ElementTypes,
    data: {}
}

export type Element = ElementSchema & (
    {
        type: "textbox",
        data: TextboxData
    }
)

export type PickElement<T extends ElementTypes> = Element & { type: T }

const elementsMap: Record<
    ElementTypes,
    React.ComponentType<ElementProps & { element: any }>
> = {
    "textbox": Textbox
}

const defaultDataMap: Record<ElementTypes, any> = {
    "textbox": textboxDefaultData
}

export function getElementByType<T extends ElementTypes>(
    type: T
): React.ComponentType<ElementProps & { element: PickElement<T> }> {
    return elementsMap[type]
}

export function getDefaultDataByType<T extends ElementTypes>(
    type: T
): PickElement<T>["data"] {
    return defaultDataMap[type]
}
