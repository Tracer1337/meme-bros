import { createContext } from "react"
import { DeepPartial } from "tsdef"
import EventEmitter from "../../lib/EventEmitter"
import { Canvas, CanvasElement } from "../../types"

export type ScreenEvents = "press"

export type ElementEvents = "create" | "edit" | "remove" | "config"

type Events = {
    "element.create": CanvasElement["type"],
    "element.edit": CanvasElement["id"],
    "element.remove": CanvasElement["id"],
    "element.config": CanvasElement["id"],
    "canvas.render": ContextValue["canvas"],
    "canvas.render.done": ContextValue["canvas"],
    "canvas.base.import": null,
    "canvas.base.blank": null,
    "canvas.base.dummy": null,
    "canvas.clear": null
}

export type ContextValue = {
    set: (partial: DeepPartial<ContextValue>) => void,
    events: EventEmitter<Events>,
    interactions: {
        focus: CanvasElement["id"] | null
    },
    canvas: Canvas
}

export const contextDefaultValue: ContextValue = {
    set: () => {},
    events: new EventEmitter<Events>({ suppressWarnings: true }),
    interactions: {
        focus: null
    },
    canvas: {
        width: 0,
        height: 0,
        debug: false,
        backgroundColor: "#fffff",
        elements: []
    }
}

export const EditorContext = createContext<ContextValue>(
    contextDefaultValue
)
