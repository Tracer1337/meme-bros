import * as Core from "@meme-bros/core"
import React, { createContext, RefObject, useContext, useEffect, useRef } from "react"
import { DeepPartial } from "tsdef"
import WebView, { WebViewMessageEvent } from "react-native-webview"
import EventEmitter from "./EventEmitter"
import { setDOMListeners, setListeners } from "./events"
import type { SharedContext } from "./context"

export namespace Bridge {
    export type Events = {
        "context.set": DeepPartial<SharedContext.ContextValue>,
        "element.create": DeepPartial<Core.CanvasElement>,
        "element.create.default": Core.CanvasElement["type"],
        "canvas.undo": null
    }

    export type Message<K extends keyof Events = any> = {
        event: K,
        data: Events[K]
    }
    
    export type Messages = {
        [K in keyof Events]: Message<K>
    }

    export enum Messaging {
        NATIVE,
        WEB
    }

    export type ContextValue = EventEmitter<Events>
}

const events: (keyof Bridge.Events)[] = [
    "context.set",
    "element.create",
    "element.create.default",
    "canvas.undo"
]

export const BridgeContext = createContext<Bridge.ContextValue>(
    new EventEmitter()
)

export function useBridge() {
    return useContext(BridgeContext)
}

export function BridgeProvider(props: React.PropsWithChildren<{}>) {
    const bridge = useRef(new EventEmitter<Bridge.Events>()).current

    return React.createElement(
        BridgeContext.Provider,
        { value: bridge },
        props.children
    )
}

function useBridgeListener(send: (message: Bridge.Message) => void) {
    const bridge = useContext(BridgeContext)

    useEffect(() => setListeners(bridge,
        events.map((event) => [
            event,
            (data: any) => send({ event, data })
        ])
    ))
}

export function useWindowMessaging() {
    const bridge = useContext(BridgeContext)

    useBridgeListener((message) => {
        const json = JSON.stringify(message)
        if ("ReactNativeWebView" in window) {
            // @ts-ignore
            window.ReactNativeWebView.postMessage(json)
        }
        window.postMessage(json)
    })

    useEffect(() => setDOMListeners(document, [
        ["message", (event: MessageEvent<string>) => {
            if (typeof event.data !== "string") {
                return
            }
            const message = JSON.parse(event.data) as Bridge.Message
            bridge.emit(message.event, message)
        }]
    ]))
}

export function useRNWebViewMessaging(webview: RefObject<WebView>) {
    const bridge = useContext(BridgeContext)

    useBridgeListener((message) => {
        if (!webview.current) {
            return
        }
        webview.current.postMessage(JSON.stringify(message))
    })

    const onMessage = (event: WebViewMessageEvent) => {
        const message = JSON.parse(event.nativeEvent.data) as Bridge.Message
        bridge.emit(message.event, message)
    }    

    return { onMessage }
}
