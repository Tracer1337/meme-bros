import { createContext } from "react"
import { DeepPartial } from "tsdef"
import * as Core from "@meme-bros/core"
import EventEmitter from "../../lib/EventEmitter"

export type ScreenEvents = "press"

export type ElementEvents = "create" | "edit" | "remove" | "config"

type Events = {
    "element.create": Core.CanvasElement["type"],
    "element.edit": Core.CanvasElement["id"],
    "element.remove": Core.CanvasElement["id"],
    "element.config": Core.CanvasElement["id"],
    "canvas.render": null,
    "canvas.undo": null,
    "canvas.render.done": null,
    "canvas.base.import": null,
    "canvas.base.blank": null,
    "canvas.base.dummy": null,
    "canvas.clear": null
}

export type ContextValue = {
    set: (partial: DeepPartial<ContextValue>) => void,
    events: EventEmitter<Events>,
    renderCanvas: boolean
}

export const contextDefaultValue: ContextValue = {
    set: () => {},
    events: new EventEmitter<Events>({ suppressWarnings: true }),
    renderCanvas: false
}

export const EditorContext = createContext<ContextValue>(
    contextDefaultValue
)
