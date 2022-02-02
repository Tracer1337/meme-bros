import React, { createContext, useContext, useState } from "react"
import { DeepPartial } from "tsdef"
import produce from "immer"
import * as API from "@meme-bros/api-sdk"
import EventEmitter from "./EventEmitter"
import { useBridge, Bridge } from "./bridge"
import { useListeners } from "./events"
import { Editor } from "./editor"
import { deepmerge } from "./utils"

export namespace SharedContext {
    export type ElementEvents = "create" | "edit" | "remove" | "config"

    export type Events = {
        "element.create": DeepPartial<Editor.CanvasElement>,
        "element.create.default": Editor.CanvasElement["type"],
        "element.edit": Editor.CanvasElement["id"],
        "element.remove": Editor.CanvasElement["id"],
        "element.config": Editor.CanvasElement["id"],
        "element.copy": Editor.CanvasElement["id"],
        "element.layer": { id: Editor.CanvasElement["id"], layer: -1 | 1 },
        "canvas.render": undefined,
        "canvas.render.done": undefined,
        "canvas.base.import": undefined,
        "canvas.base.blank": undefined,
        "canvas.base.dummy": undefined,
        "canvas.base.config": undefined,
        "canvas.load": undefined,
        "template.load": { template: API.Template, canvas: Editor.Canvas },
        "history.push": undefined,
        "history.pop": undefined
    }

    export type ContextValue = {
        set: (partial: DeepPartial<ContextValue>, emit?: boolean) => void,
        events: EventEmitter<Events>,
        interactions: {
            focus: Editor.CanvasElement["id"] | null
        },
        template: API.Template | null,
        canvasDomRect: DOMRect | null,
        renderCanvas: boolean,
        canvas: Editor.Canvas
    }
}

export const defaultContextValue: SharedContext.ContextValue = {
    set: () => defaultContextValue,
    events: new EventEmitter<SharedContext.Events>({ suppressWarnings: true }),
    interactions: {
        focus: null
    },
    template: null,
    canvasDomRect: null,
    renderCanvas: false,
    canvas: {
        width: 0,
        height: 0,
        pixelRatio: 1,
        debug: false,
        mode: Editor.CanvasMode.BLANK,
        backgroundColor: "#fffff",
        elements: {},
        layers: []
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
        setContext((context) => {
            const newState = applyMiddleware(
                deepmerge(context, partial) as SharedContext.ContextValue
            )
            newState.events = defaultContextValue.events
            return newState
        })
        if (emit) {
            bridge.send({
                event: "context.set",
                data: partial
            })
        }
    }

    useListeners(context.events, [
        // @ts-ignore
        ["emit", ({ event, data }) =>
            bridge.send({
                event: "context.event",
                data: { event, data }
            })
        ]
    ])

    useListeners(bridge.messages, [
        ["context.set", (partial: Bridge.Events["context.set"]) =>
            context.set(partial, false)
        ],
        ["context.event", ({ event, data }: Bridge.Events["context.event"]) =>
            context.events.emit(event, data, false)
        ]
    ])

    return React.createElement(
        SharedContext.Provider,
        { value: context },
        props.children
    )
}

const middleware = [removeElements]

function applyMiddleware(state: SharedContext.ContextValue) {
    return produce(state, (draft) => {
        middleware.forEach((fn) => fn(draft))
    })
}

function removeElements(state: SharedContext.ContextValue) {
    Object.keys(state.canvas.elements).forEach((key) => {
        const id = parseInt(key)
        if (!state.canvas.layers.includes(id)) {
            delete state.canvas.elements[id]
        }
    })
}
