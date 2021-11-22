import React from "react"
import Textbox, { TextboxData } from "./Textbox"

type Rect = {
    x: number,
    y: number,
    width: number,
    height: number,
    rotation: number
}

type ElementSchema = {
    id: number,
    rect: Rect,
    type: string,
    data: {}
}

export type Element = ElementSchema & (
    {
        type: "textbox",
        data: TextboxData
    }
)

export type PickElement<T extends Element["type"]> = Element & { type: T }

const elementsMap: Record<
    Element["type"],
    React.ComponentType<{ element: any }>
> = {
    "textbox": Textbox
}

export function getElementByType<T extends Element["type"]>(
    type: T
): React.ComponentType<{ element: PickElement<T> }> {
    return elementsMap[type]
}
