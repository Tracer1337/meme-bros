import * as Core from "@meme-bros/core"
import { RefObject, useEffect, useRef } from "react"
import { FirstArgument, AnyFunction, DeepPartial } from "tsdef"
import WebView, { WebViewMessageEvent } from "react-native-webview"
import EventEmitter from "./EventEmitter"
import { setDOMListeners, setListeners } from "./events"
import { makeId } from "./utils"

export namespace Bridge {
    export type Methods = {
        "element.create": (e: DeepPartial<Core.CanvasElement>) => void,
        "element.create.default": (t: Core.CanvasElement["type"]) => void,
        "element.copy": (id: Core.CanvasElement["id"]) => void,
        "element.layer": (args: {
            id: Core.CanvasElement["id"],
            layer: -1 | 1
        }) => void,
        "element.focus": (id: Core.CanvasElement["id"] | null) => void,
        "canvas.render": () => Core.Canvas,
        "canvas.undo": () => void,
        "canvas.set": (c: DeepPartial<Core.Canvas>) => void
    }
    
    export type Events = {
        [K in keyof Methods]: FirstArgument<Methods[K]>
    } & {
        [K in keyof Methods as `r:${K}`]: ReturnType<Methods[K]>
    }
    
    export type Message<K extends keyof Events = any> = {
        id: number,
        event: K,
        data: Events[K]
    }
    
    export type Messages = {
        [K in keyof Events]: Message<K>
    }
}

const methods: (keyof Bridge.Methods)[] = [
    "element.create",
    "element.create.default",
    "element.copy",
    "element.layer",
    "element.focus",
    "canvas.render",
    "canvas.undo",
    "canvas.set"
]

const willResolve = new Set([
    "canvas.render"
] as (keyof Bridge.Methods)[])

export function useBridge(
    messages: EventEmitter<Bridge.Events>,
    send: (message:Bridge. Message) => void,
    implementations: Partial<Bridge.Methods>
) {
    const resolvers = useRef<Record<number, AnyFunction>>({}).current
    
    const request = <
        T extends keyof Bridge.Methods
    >(event: T, data: Bridge.Events[T]) => {
        return new Promise<ReturnType<Bridge.Methods[T]>>((resolve) => {
            const id = makeId()
            if (willResolve.has(event)) {
                resolvers[id] = resolve
            }
            send({ id, event, data })
        })
    }

    const getImplementation = (key: keyof Bridge.Methods): AnyFunction => {
        return implementations[key] || (() => {
            throw new Error(`Method '${key}' not implemented`)
        })
    }

    const handleRequest = (event: keyof Bridge.Methods) =>
        (req: Bridge.Message) => {
            send({
                id: req.id,
                event: `r:${event}`,
                data: getImplementation(event)(req.data)
            })
        }

    const handleResponse = (res: Bridge.Message) => {
        if (res.id in resolvers) {
            resolvers[res.id](res.data)
            delete resolvers[res.id]
        }
    }

    useEffect(() =>
        setListeners(messages, methods.flatMap(
            (event) => [
                [event, handleRequest(event)],
                [`r:${event}` as keyof Bridge.Events, handleResponse]
            ]
        ))
    )

    return request
}

export function useWindowMessaging() {
    const messages = useRef(new EventEmitter<Bridge.Messages>()).current

    const send = (message: Bridge.Message) => {
        const json = JSON.stringify(message)
        if ("ReactNativeWebView" in window) {
            // @ts-ignore
            window.ReactNativeWebView.postMessage(json)
        }
        window.postMessage(json)
    }

    useEffect(() => setDOMListeners(document, [
        ["message", (event: MessageEvent<string>) => {
            if (typeof event.data !== "string") {
                return
            }
            const message = JSON.parse(event.data) as Bridge.Message
            messages.emit(message.event, message)
        }]
    ]))

    return { messages, send }
}

export function useRNWebViewMessaging(webview: RefObject<WebView>) {
    const messages = useRef(new EventEmitter<Bridge.Messages>()).current

    const send = (message: Bridge.Message) => {
        if (!webview.current) {
            return
        }
        webview.current.postMessage(JSON.stringify(message))
    }

    const onMessage = (event: WebViewMessageEvent) => {
        const message = JSON.parse(event.nativeEvent.data) as Bridge.Message
        messages.emit(message.event, message)
    }

    return { messages, send, onMessage }
}
