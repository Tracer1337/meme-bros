import produce, { setAutoFreeze } from "immer"
import { createContext } from "react"
import { DeepPartial } from "tsdef"
import * as Core from "@meme-bros/core"
import EventEmitter from "../lib/EventEmitter"
import { clone, makeId } from "./utils"

export type ElementEvents = "create" | "edit" | "remove" | "config"

export type Events = {
    "element.create": DeepPartial<Core.CanvasElement>,
    "element.create.default": Core.CanvasElement["type"],
    "element.edit": Core.CanvasElement["id"],
    "element.remove": Core.CanvasElement["id"],
    "element.config": Core.CanvasElement["id"],
    "canvas.clear": null,
    "canvas.dimensions.set": Pick<Core.Canvas, "width" | "height">
}

export type ContextValue = {
    set: (partial: DeepPartial<ContextValue>) => ContextValue,
    push: () => void,
    pop: () => void,
    events: EventEmitter<Events>,
    interactions: {
        focus: Core.CanvasElement["id"] | null
    },
    canvasDomRect: DOMRect | null,
    canvas: Core.Canvas
}

export const defaultContextValue: ContextValue = {
    set: () => defaultContextValue,
    push: () => {},
    pop: () => {},
    events: new EventEmitter<Events>({ suppressWarnings: true }),
    interactions: {
        focus: null
    },
    canvasDomRect: null,
    canvas: {
        width: 0,
        height: 0,
        pixelRatio: 1,
        debug: false,
        backgroundColor: "#fffff",
        elements: []
    }
}

export const CanvasContext = createContext<ContextValue>(
    defaultContextValue
)

setAutoFreeze(false)

export function updateElementData<T extends Core.CanvasElement["type"]>(
    state: ContextValue,
    element: Core.PickElement<T>,
    data: Core.PickElement<T>["data"]
) {
    return produce(state, (draft) => {
        const newElement = draft.canvas.elements.find(
            (e) => e.id === element.id
        ) as Core.PickElement<T>
        if (newElement) {
            newElement.data = data
        }
    })
}

export function updateElementRect(
    state: ContextValue,
    element: Core.CanvasElement,
    rect: Core.Rect
) {
    return produce(state, (draft) => {
        const newElement = draft.canvas.elements.find(
            (e) => e.id === element.id
        )
        if (!newElement) {
            return
        }
        newElement.rect = rect
    })
}

export function removeElement(state: ContextValue, id: number) {
    return produce(state, (draft) => {
        const index = draft.canvas.elements.findIndex(
            (e) => e.id === id
        )
        draft.canvas.elements.splice(index, 1)
        if (draft.interactions.focus === id) {
            draft.interactions.focus = null
        }
    })
}

export function copyElement(state: ContextValue, id: number) {
    return produce(state, (draft) => {
        const element = draft.canvas.elements.find((e) => e.id === id)
        if (!element) {
            return
        }
        const newElement = clone(element)
        newElement.id = makeId()
        newElement.rect.x = 0
        newElement.rect.y = 0
        draft.canvas.elements.push(newElement)
        draft.interactions.focus = newElement.id
    })
}

export function updateTextboxText(
    state: ContextValue,
    element: Core.PickElement<"textbox">,
    text: string
) {
    return produce(state, (draft) => {
        const newElement = draft.canvas.elements.find(
            (e) => e.id === element.id
        ) as Core.PickElement<"textbox">
        if (!newElement) {
            return
        }
        newElement.data.text = text
    })
}
