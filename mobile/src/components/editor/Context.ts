import { createContext } from "react"
import { GestureResponderEvent, ImageSourcePropType } from "react-native"
import { DeepPartial } from "tsdef"
import EventEmitter from "../../lib/EventEmitter"
import { Element, ElementSchema } from "./elements"

export type ScreenEvents = "press"

export type ElementEvents = "edit"

type Events = {
    "screen.press": GestureResponderEvent,
    "element.create": ElementSchema["type"],
    "element.edit": ElementSchema["id"]
}

export type ContextValue = {
    set: (partial: DeepPartial<ContextValue>) => void,
    events: EventEmitter<Events>,
    dimensions: {
        width: number,
        height: number
    },
    canvas: {
        imageSource: ImageSourcePropType | null,
        elements: Element[],
        focus: Element["id"] | null
    }
}

export const contextDefaultValue: ContextValue = {
    set: () => {},
    events: new EventEmitter<Events>({ suppressWarnings: true }),
    dimensions: { width: 0, height: 0 },
    canvas: {
        imageSource: null,
        elements: [],
        focus: null
    }
}

export const EditorContext = createContext<ContextValue>(
    contextDefaultValue
)
