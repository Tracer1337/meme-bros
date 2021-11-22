import React from "react"
import Textbox, { TextboxData } from "./Textbox"

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
    React.ComponentType<{ element: any }>
> = {
    "textbox": Textbox
}

export function getElementByType<T extends ElementTypes>(
    type: T
): React.ComponentType<{ element: PickElement<T> }> {
    return elementsMap[type]
}
