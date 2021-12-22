import produce, { setAutoFreeze } from "immer"
import { createContext } from "react"
import { DeepPartial } from "tsdef"
import EventEmitter from "../lib/EventEmitter"
import { Canvas, CanvasElement, PickElement, Rect } from "../types"

export type ElementEvents = "create" | "edit" | "remove" | "config"

export type Events = {
    "element.create": DeepPartial<CanvasElement>,
    "element.create.default": CanvasElement["type"],
    "element.edit": CanvasElement["id"],
    "element.remove": CanvasElement["id"],
    "element.config": CanvasElement["id"],
    "canvas.clear": null,
    "canvas.dimensions.set": Pick<Canvas, "width" | "height">
}

export type ContextValue = {
    set: (partial: DeepPartial<ContextValue>) => ContextValue,
    push: () => void,
    pop: () => void,
    events: EventEmitter<Events>,
    interactions: {
        focus: CanvasElement["id"] | null
    },
    canvas: Canvas
}

export const defaultContextValue: ContextValue = {
    set: () => defaultContextValue,
    push: () => {},
    pop: () => {},
    events: new EventEmitter<Events>({ suppressWarnings: true }),
    interactions: {
        focus: null
    },
    canvas: {
        domRect: null,
        width: 0,
        height: 0,
        debug: false,
        backgroundColor: "#fffff",
        elements: []
    }
}

export const CanvasContext = createContext<ContextValue>(
    defaultContextValue
)

setAutoFreeze(false)

export function updateElementData<T extends CanvasElement["type"]>(
    state: ContextValue,
    element: PickElement<T>,
    data: PickElement<T>["data"]
) {
    return produce(state, (draft) => {
        const newElement = draft.canvas.elements.find(
            (e) => e.id === element.id
        ) as PickElement<T>
        if (newElement) {
            newElement.data = data
        }
    })
}

export function updateElementRect(
    state: ContextValue,
    element: CanvasElement,
    rect: Rect
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
    })
}

export function updateTextboxText(
    state: ContextValue,
    element: PickElement<"textbox">,
    text: string
) {
    return produce(state, (draft) => {
        const newElement = draft.canvas.elements.find(
            (e) => e.id === element.id
        ) as PickElement<"textbox">
        if (!newElement) {
            return
        }
        newElement.data.text = text
    })
}
