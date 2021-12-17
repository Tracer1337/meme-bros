import { RefObject, useContext, useEffect, useRef } from "react"
import WebView, { WebViewMessageEvent } from "react-native-webview"
import EventEmitter from "../../../lib/EventEmitter"
import { setListeners } from "../../../lib/events"
import { Canvas, CanvasElement } from "../../../types"
import { EditorContext } from "../Context"

type Events = {
    "element.create": CanvasElement["type"],
    "canvas.render": null
}

type Responses = {
    "canvas.render": Canvas
}

type Event<T extends keyof Events> = {
    type: T,
    data: Events[T]
}

export function useBridge(webview: RefObject<WebView>) {
    const context = useContext(EditorContext)

    const events = useRef(new EventEmitter<Responses>()).current

    const onMessage = (event: WebViewMessageEvent) => {
        const data = JSON.parse(event.nativeEvent.data)
        events.emit(data.type, data.data)
    }

    const handleElementCreate = (type: CanvasElement["type"]) => {
        if (!webview.current) {
            return
        }
        const message: Event<"element.create"> = {
            type: "element.create",
            data: type
        }
        webview.current.postMessage(JSON.stringify(message))
    }

    const handleCanvasRender = () => {
        if (!webview.current) {
            return
        }
        const message: Event<"canvas.render"> = {
            type: "canvas.render",
            data: null
        }
        webview.current.postMessage(JSON.stringify(message))
    }

    useEffect(() =>
        setListeners(context.events, [
            ["element.create", handleElementCreate],
            ["canvas.render", handleCanvasRender]
        ])
    )

    return { onMessage, events }
}
