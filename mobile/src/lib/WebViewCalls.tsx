import React, { useContext, useRef } from "react"
import { View } from "react-native"
import WebView, { WebViewMessageEvent } from "react-native-webview"
import useId from "./useId"
import webviewLib from "./webview-lib"

const html = `

${webviewLib}

<script>

function getNewFontsize(div) {
    textfit(div, {
        multiLine: true,
        minFontSize: 1,
        maxFontSize: window.innerHeight
    })
    const span = div.querySelector("span")
    const fontSize = getComputedStyle(span).fontSize
    return parseInt(fontSize)
}

function customTextfit({
    text,
    fontFamily,
    fontWeight,
    width,
    height
}) {
    width = Math.floor(width)
    height = Math.floor(height)

    if (width <= 0 || height <= 0) {
        return 0
    }

    const div = document.createElement("div")

    Object.assign(div.style, {
        position: "absolute",
        width: width + "px",
        height: height + "px",
        whiteSpace: "pre-wrap"
    })

    div.textContent = text
    document.body.appendChild(div)
    const fontSize = getNewFontsize(div)
    document.body.removeChild(div)

    return fontSize
}

const methods = {
    textfit: customTextfit,
    ping: () => "pong"
}

function postMessage(message) {
    window.ReactNativeWebView.postMessage(
        JSON.stringify(message)
    )
}

function call({ id, method, args }) {
    // postMessage({ type: "log", message: { id, method, args } })
    try {
        postMessage({
            type: "response",
            id,
            data: methods[method](...args)
        })
    } catch (error) {
        postMessage({
            type: "error",
            message: error.message
        })
    }
}

</script>

`

export type WebViewMethods = {
    textfit: (options: {
        text: string,
        fontFamily: string,
        fontWeight: string,
        width: number,
        height: number
    }) => number,
    ping: () => "pong"
}

type WebViewResponse = {
    type: "error",
    message: string
} | {
    type: "response",
    id: number,
    data: any
} | {
    type: "log",
    message: any
}

type WebViewContextValue = {
    call: <T extends keyof WebViewMethods>({ method, args }: { 
        method: T,
        args: Parameters<WebViewMethods[T]>
    }) => Promise<ReturnType<WebViewMethods[T]>>
}

const webViewContextDefaultValue: WebViewContextValue = {
    call: (() => {
        console.warn("This method is not initialized")
    }) as any
}

export const WebViewContext = React.createContext(webViewContextDefaultValue)

export function WebViewProvider({ children }: React.PropsWithChildren<{}>) {
    return (
        <WebViewContext.Provider value={webViewContextDefaultValue}>
            <CustomWebView/>
            {children}
        </WebViewContext.Provider>
    )
}

function CustomWebView() {
    const getId = useId()

    const context = useContext(WebViewContext)

    if (!context) {
        throw new Error("WebView can only be rendered inside WebView-Context")
    }
    
    const webview = useRef<WebView>(null)
    const resolvers = useRef<Record<string, (data: any) => void>>({}).current

    const receiveMessage = (event: WebViewMessageEvent) => {
        const message = JSON.parse(event.nativeEvent.data) as WebViewResponse
        switch (message.type) {
            case "error":
                console.log("Error", message.message)
                break;
            case "log":
                console.log("Log", message.message)
                break
            case "response":
                const resolver = resolvers[message.id]
                resolver?.(message.data)
                break
            default:
                console.warn("Could not handle message", message)
        }
    }
    
    const callWebView = <T extends keyof WebViewMethods>({ method, args }: { 
        method: T,
        args: Parameters<WebViewMethods[T]>
    }) => {
        return new Promise<ReturnType<WebViewMethods[T]>>((resolve) => {
            const callId = getId()
            webview.current?.injectJavaScript(`
                call({
                    id: ${JSON.stringify(callId)},
                    method: ${JSON.stringify(method)},
                    args: ${JSON.stringify(args)}
                })
            `)
            resolvers[callId] = resolve
        })
    }

    context.call = callWebView

    return (
        <View style={{ width: 300, height: 300 }}>
            <WebView
                originWhitelist={["*"]}
                source={{ html }}
                ref={webview}
                onMessage={receiveMessage}
                style={{ width: 300, height: 300 }}
            />
        </View>
    )
}
