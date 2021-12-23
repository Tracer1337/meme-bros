import * as Core from "@meme-bros/core"
import { RefObject, useEffect, useRef } from "react"
import { FirstArgument, AnyFunction, DeepPartial } from "tsdef"
import WebView, { WebViewMessageEvent } from "react-native-webview"
import EventEmitter from "./EventEmitter"
import { setDOMListeners, setListeners } from "./events"

type Methods = {
    "element.create": (e: DeepPartial<Core.CanvasElement>) => void,
    "element.create.default": (t: Core.CanvasElement["type"]) => void,
    "canvas.render": () => Core.Canvas,
    "canvas.undo": () => void,
    "canvas.set": (c: DeepPartial<Core.Canvas>) => void
}

type Events = {
    [K in keyof Methods]: FirstArgument<Methods[K]>
} & {
    [K in keyof Methods as `r:${K}`]: ReturnType<Methods[K]>
}

type Message<K extends keyof Events = any> = {
    id: number,
    event: K,
    data: Events[K]
}

type Messages = {
    [K in keyof Events]: Message<K>
}

const methods: (keyof Methods)[] = [
    "element.create",
    "element.create.default",
    "canvas.render",
    "canvas.undo",
    "canvas.set"
]

function makeId() {
    return Math.floor(Math.random() * 1e8)
}

export function useBridge(
    messages: EventEmitter<Events>,
    send: (message: Message) => void,
    implementations: Partial<Methods>
) {
    const resolvers = useRef<Record<number, AnyFunction>>({}).current
    
    const request = <T extends keyof Methods>(event: T, data: Events[T]) => {
        return new Promise<ReturnType<Methods[T]>>((resolve) => {
            const id = makeId()
            resolvers[id] = resolve
            send({ id, event, data })
        })
    }

    const getImplementation = (key: keyof Methods): AnyFunction => {
        return implementations[key] || (() => {
            throw new Error(`Method '${key}' not implemented`)
        })
    }

    const handleRequest = (event: keyof Methods) => (req: Message) => {
        send({
            id: req.id,
            event: `r:${event}`,
            data: getImplementation(event)(req.data)
        })
    }

    const handleResponse = (res: Message) => {
        if (res.id in resolvers) {
            resolvers[res.id](res.data)
            delete resolvers[res.id]
        }
    }

    useEffect(() =>
        setListeners(messages, methods.flatMap(
            (event) => [
                [event, handleRequest(event)],
                [`r:${event}` as keyof Events, handleResponse]
            ]
        ))
    )

    return request
}

export function useWindowMessaging() {
    const messages = useRef(new EventEmitter<Messages>()).current

    const send = (message: Message) => {
        if ("ReactNativeWebView" in window) {
            // @ts-ignore
            window.ReactNativeWebView.postMessage(
                JSON.stringify(message)
            )
        }
        window.postMessage(message)
    }

    useEffect(() => setDOMListeners(document, [
        ["message", (event: MessageEvent<string>) => {
            if (typeof event.data !== "string") {
                return
            }
            const message = JSON.parse(event.data) as Message
            messages.emit(message.event, message)
        }]
    ]))

    return { messages, send }
}

export function useRNWebViewMessaging(webview: RefObject<WebView>) {
    const messages = useRef(new EventEmitter<Messages>()).current

    const send = (message: Message) => {
        if (!webview.current) {
            return
        }
        webview.current.postMessage(JSON.stringify(message))
    }

    const onMessage = (event: WebViewMessageEvent) => {
        const message = JSON.parse(event.nativeEvent.data) as Message
        messages.emit(message.event, message)
    }

    return { messages, send, onMessage }
}

// function Web() {
//     const { messages, send } = useWindowMessaging()
//     const request = useBridge(messages, send, {
//         "canvas.render": () => {
//             return context.canvas
//         }
//     })

//     const handleFocusElement = async (id: number) => {
//         await request("element.focus", id)
//     }

//     return React.createElement("div")
// }

// function Mobile() {
//     const webview = useRef<WebView>(null)
    
//     const { messages, send, onMessage } = useRNWebViewMessaging(webview)
//     const request = useBridge(messages, send, {
//         "element.focus": (id) => {
//             context.set({ focus: { id } })
//         }
//     })

//     const handleRender = async () => {
//         const canvas = await request("canvas.render", null)
//     }

//     return React.createElement(WebView, { onMessage, ref: webview })
// }
