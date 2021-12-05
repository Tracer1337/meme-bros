import { createContext } from "react"
import { GestureResponderEvent } from "react-native"
import { DeepPartial } from "tsdef"
import EventEmitter from "../../lib/EventEmitter"
import { Canvas, CanvasElement } from "../../types"

export type ScreenEvents = "press"

export type ElementEvents = "create" | "edit" | "remove" | "config"

type Events = {
    "screen.press": GestureResponderEvent,
    "element.create": CanvasElement["type"],
    "element.edit": CanvasElement["id"],
    "element.remove": CanvasElement["id"],
    "element.config": CanvasElement["id"],
    "canvas.generate": ContextValue["canvas"]
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
        backgroundColor: [255, 255, 255, 255],
        elements: []
    }
}

export const EditorContext = createContext<ContextValue>(
    contextDefaultValue
)
