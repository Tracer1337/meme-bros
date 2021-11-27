import { createContext } from "react"
import { GestureResponderEvent } from "react-native"
import { DeepPartial } from "tsdef"
import EventEmitter from "../../lib/EventEmitter"
import { Element, ElementSchema } from "./elements"

export type ScreenEvents = "press"

export type ElementEvents = "create" | "edit" | "remove" | "config"

type Events = {
    "screen.press": GestureResponderEvent,
    "element.create": ElementSchema["type"],
    "element.edit": ElementSchema["id"],
    "element.remove": ElementSchema["id"],
    "element.config": ElementSchema["id"],
    "canvas.generate": ContextValue["canvas"]
}

export type ContextValue = {
    set: (partial: DeepPartial<ContextValue>) => void,
    events: EventEmitter<Events>,
    dimensions: {
        width: number,
        height: number
    },
    interactions: {
        focus: Element["id"] | null
    },
    canvas: {
        image: {
            uri: string,
            width: number,
            height: number
        } | null,
        elements: Element[],
    }
}

export const contextDefaultValue: ContextValue = {
    set: () => {},
    events: new EventEmitter<Events>({ suppressWarnings: true }),
    dimensions: { width: 0, height: 0 },
    interactions: {
        focus: null
    },
    canvas: {
        image: null,
        elements: []
    }
}

export const EditorContext = createContext<ContextValue>(
    contextDefaultValue
)
