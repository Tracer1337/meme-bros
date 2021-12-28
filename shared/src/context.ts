import React, { createContext, useContext, useState } from "react"
import { DeepPartial } from "tsdef"
import * as Core from "@meme-bros/core"
import deepmerge from "deepmerge"
import { isPlainObject } from "is-plain-object"
import EventEmitter from "./EventEmitter"
import { useBridge } from "./bridge"
import { useQueuedListeners } from "./events"

export namespace SharedContext {
    export type ElementEvents = "create" | "edit" | "remove" | "config"

    export type Events = {
        "element.create": DeepPartial<Core.CanvasElement>,
        "element.create.default": Core.CanvasElement["type"],
        "element.edit": Core.CanvasElement["id"],
        "element.remove": Core.CanvasElement["id"],
        "element.config": Core.CanvasElement["id"],
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
        set: (partial: DeepPartial<ContextValue>) => void,
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

export function useSharedContext() {
    return useContext(SharedContext)
}

export function SharedContextProvider(props: React.PropsWithChildren<{}>) {
    const bridge = useBridge()

    const [context, setContext] = useState(defaultContextValue)

    context.set = (partial) => {
        bridge.emit("context.set", partial)
    }

    useQueuedListeners(bridge, [
        ["context.set", (partial) => {
            const newState = deepmerge(context, partial, {
                isMergeableObject: isPlainObject,
                arrayMerge: (_dest, source) => source
            }) as SharedContext.ContextValue
            setContext(newState)
        }]
    ])

    console.log(context)

    return React.createElement(
        SharedContext.Provider,
        { value: context },
        props.children
    )
}
