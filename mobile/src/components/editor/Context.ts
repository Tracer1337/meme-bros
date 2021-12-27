import { createContext } from "react"
import { DeepPartial } from "tsdef"
import * as Core from "@meme-bros/core"
import { Events as BridgeEvents } from "@meme-bros/bridge"
import EventEmitter from "../../lib/EventEmitter"

export type ScreenEvents = "press"

export type ElementEvents = "create" | "edit" | "remove" | "config"

export type ContextEvents = {
    "element.create": Core.CanvasElement["type"],
    "element.edit": Core.CanvasElement["id"],
    "element.remove": Core.CanvasElement["id"],
    "element.copy": Core.CanvasElement["id"],
    "element.layer": BridgeEvents["element.layer"],
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
    events: EventEmitter<ContextEvents>,
    renderCanvas: boolean,
    interactions: {
        focus: number | null
    }
}

export const contextDefaultValue: ContextValue = {
    set: () => {},
    events: new EventEmitter<ContextEvents>({ suppressWarnings: true }),
    renderCanvas: false,
    interactions: {
        focus: null
    }
}

export const EditorContext = createContext<ContextValue>(
    contextDefaultValue
)
