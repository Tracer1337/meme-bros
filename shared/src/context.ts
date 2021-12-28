import { createContext } from "react"
import { DeepPartial } from "tsdef"
import * as Core from "@meme-bros/core"
import EventEmitter from "./EventEmitter"
import { Events as BridgeEvents } from "./bridge"

export namespace SharedContext {
    export type ScreenEvents = "press"

    export type ElementEvents = "create" | "edit" | "remove" | "config"

    export type Events = {
        "element.create": DeepPartial<Core.CanvasElement>,
        "element.create.default": Core.CanvasElement["type"],
        "element.edit": Core.CanvasElement["id"],
        "element.remove": Core.CanvasElement["id"],
        "element.config": Core.CanvasElement["id"],
        "element.copy": Core.CanvasElement["id"],
        "element.layer": BridgeEvents["element.layer"],
        "canvas.render": null,
        "canvas.undo": null,
        "canvas.render.done": null,
        "canvas.base.import": null,
        "canvas.base.blank": null,
        "canvas.base.dummy": null,
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
}

export const defaultContextValue: SharedContext.ContextValue = {
    set: () => defaultContextValue,
    push: () => {},
    pop: () => {},
    events: new EventEmitter<SharedContext.Events>({ suppressWarnings: true }),
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

export const SharedContext = createContext<SharedContext.ContextValue>(
    defaultContextValue
)
