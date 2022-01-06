import React, { createContext, RefObject, useContext, useEffect, useRef } from "react"
import { DeepPartial } from "tsdef"
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
            bridge.messages.emit(message.event, message.data)
        }]
    ]))
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
        console.log(event.nativeEvent)
        return
        const message = JSON.parse(event.nativeEvent.data) as Bridge.Message
        bridge.messages.emit(message.event, message.data)
    }    

    return { onMessage }
}
