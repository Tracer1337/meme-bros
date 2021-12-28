import React, { createContext, useContext, useState } from "react"
import { DeepPartial } from "tsdef"
import * as Core from "@meme-bros/core"
import deepmerge from "deepmerge"
import { isPlainObject } from "is-plain-object"
import EventEmitter from "./EventEmitter"
import { useBridge, Bridge } from "./bridge"
import { useQueuedListeners, useListeners } from "./events"

export namespace SharedContext {
    export type ElementEvents = "create" | "edit" | "remove" | "config"

    export type Events = {
        "element.create": DeepPartial<Core.CanvasElement>,
        "element.create.default": Core.CanvasElement["type"],
        "element.edit": Core.CanvasElement["id"],
        "element.remove": Core.CanvasElement["id"],
        "element.config": Core.CanvasElement["id"],
        "element.copy": Core.CanvasElement["id"],
        "element.layer": { id: Core.CanvasElement["id"], layer: -1 | 1 },
        "canvas.render": null,
        "canvas.render.done": null,
        "canvas.base.import": null,
        "canvas.base.blank": null,
        "canvas.base.dummy": null,
        "history.push": null,
        "history.pop": null
    }

    export type ContextValue = {
        set: (partial: DeepPartial<ContextValue>, emit?: boolean) => void,
        events: EventEmitter<Events>,
        interactions: {
            focus: Core.CanvasElement["id"] | null
        },
        canvasDomRect: DOMRect | null,
        renderCanvas: boolean,
        canvas: Core.Canvas
    }
}

export const defaultContextValue: SharedContext.ContextValue = {
    set: () => defaultContextValue,
    events: new EventEmitter<SharedContext.Events>({ suppressWarnings: true }),
    interactions: {
        focus: null
    },
    canvasDomRect: null,
    renderCanvas: false,
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

    context.set = (partial, emit = true) => {
        const newState = deepmerge(context, partial, {
            isMergeableObject: isPlainObject,
            arrayMerge: (_dest, source) => source
        }) as SharedContext.ContextValue
        newState.events = defaultContextValue.events
        setContext(newState)
        if (emit) {
            bridge.send({
                event: "context.set",
                data: partial
            })
        }
    }

    useListeners(context.events, [
        // @ts-ignore
        ["emit", ({ event, data }) => {
            console.log({ event, data })
            bridge.send({
                event: "context.event",
                data: { event, data }
            })
        }]
    ])

    useQueuedListeners(bridge.messages, [
        ["context.set", (partial: Bridge.Events["context.set"]) =>
            context.set(partial, false)
        ],
        ["context.event", ({ event, data }: Bridge.Events["context.event"]) =>
            context.events.emit(event, data)
        ]
    ])

    console.log(context)

    return React.createElement(
        SharedContext.Provider,
        { value: context },
        props.children
    )
}
