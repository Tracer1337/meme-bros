import React, { createContext, RefObject, useContext, useEffect, useRef } from "react"
import { AnyFunction, DeepPartial } from "tsdef"
import WebView, { WebViewMessageEvent } from "react-native-webview"
import EventEmitter from "./EventEmitter"
import { setDOMListeners } from "./events"
import type { SharedContext } from "./context"

export namespace Bridge {
    export type Events = {
        "context.set": DeepPartial<SharedContext.ContextValue>,
        "context.event": Message
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

    export type ContextValue = {
        send: <T extends keyof Messages>(message: Messages[T]) => void,
        messages: EventEmitter<Events>
    }
}

const defaultContextValue: Bridge.ContextValue = {
    send: () => {},
    messages: new EventEmitter()
}

export const BridgeContext = createContext<Bridge.ContextValue>(
    defaultContextValue
)

export function useBridge() {
    return useContext(BridgeContext)
}

export function BridgeProvider(props: React.PropsWithChildren<{}>) {
    const bridge = useRef(defaultContextValue).current

    return React.createElement(
        BridgeContext.Provider,
        { value: bridge },
        props.children
    )
}

export function useWindowMessaging() {
    const bridge = useBridge()

    bridge.send = (message) => {
        const json = JSON.stringify(message)
        // @ts-ignore
        window.ReactNativeWebView?.postMessage(json)
        if (window.top && window.top !== window) {
            window.top.postMessage(json)
        }
    }

    const listeners: [string, AnyFunction][] = [
        ["message", (event: MessageEvent<string>) => {
            if (typeof event.data !== "string") {
                return
            }
            const message = JSON.parse(event.data) as Bridge.Message
            bridge.messages.emit(message.event, message.data)
        }]
    ]

    useEffect(() => setDOMListeners(window, listeners))
    useEffect(() => setDOMListeners(document, listeners))
}

export function useRNWebViewMessaging(webview: RefObject<WebView>) {
    const bridge = useBridge()

    bridge.send = (message) => {
        if (!webview.current) {
            return
        }
        webview.current.postMessage(JSON.stringify(message))
    }

    const onMessage = (event: WebViewMessageEvent) => {
        if (typeof event.nativeEvent.data !== "string") {
            return
        }
        const message = JSON.parse(event.nativeEvent.data) as Bridge.Message
        bridge.messages.emit(message.event, message.data)
    }    

    return { onMessage }
}
