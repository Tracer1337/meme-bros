import { RefObject, useContext, useEffect, useRef } from "react"
import WebView, { WebViewMessageEvent } from "react-native-webview"
import { DeepPartial } from "tsdef"
import EventEmitter from "../../../lib/EventEmitter"
import { setListeners } from "../../../lib/events"
import { importImage } from "../../../lib/media"
import { Canvas, CanvasElement } from "../../../types"
import { EditorContext } from "../Context"

type Events = {
    "element.create": DeepPartial<CanvasElement>,
    "element.create.default": CanvasElement["type"],
    "canvas.render": null
}

type Responses = {
    "canvas.render": Canvas
}

type Event<T extends keyof Events> = {
    type: T,
    data: Events[T]
}

async function createPartialElement(type: CanvasElement["type"]) {
    const newElement: DeepPartial<CanvasElement> = { type }
    if (type === "image") {
        const image = await importImage()
        if (!image || !image.base64) {
            return
        }
        newElement.data = {
            uri: image.base64,
            animated: image.base64.startsWith("data:image/gif")
        }
        if (image.width && image.height) {
            newElement.rect = {}
            newElement.rect.width = newElement.data.naturalWidth = image.width
            newElement.rect.height = newElement.data.naturalHeight = image.height
        }
    }
    return newElement
}

export function useBridge(webview: RefObject<WebView>) {
    const context = useContext(EditorContext)

    const events = useRef(new EventEmitter<Responses>()).current

    const onMessage = (event: WebViewMessageEvent) => {
        const data = JSON.parse(event.nativeEvent.data)
        events.emit(data.type, data.data)
    }

    const handleElementCreate = async (type: CanvasElement["type"]) => {
        if (!webview.current) {
            return
        }
        const data = await createPartialElement(type)
        if (!data) {
            return
        }
        const message: Event<"element.create"> = {
            type: "element.create",
            data
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
