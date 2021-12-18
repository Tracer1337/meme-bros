import { useContext, useEffect } from "react"
import { DeepPartial } from "tsdef"
import { setDOMListeners } from "../../lib/events"
import { Canvas, CanvasElement } from "../../types"
import { EditorContext } from "../Context"

type Events = {
    "element.create": DeepPartial<CanvasElement>,
    "element.create.default": CanvasElement["type"],
    "canvas.render": null,
    "canvas.clear": null
}

type Responses = {
    "canvas.render": Canvas
}

type Event<T extends keyof Events> = {
    id: number,
    type: T,
    data: Events[T]
}

type Response<T extends keyof Responses> = {
    id: number,
    type: T,
    data: Responses[T]
}

export function useBridge() {
    const context = useContext(EditorContext)

    const postMessage = <T extends keyof Responses>(
        message: Response<T>
    ) => {
        if ("ReactNativeWebView" in window) {
            // @ts-ignore
            window.ReactNativeWebView.postMessage(
                JSON.stringify(message)
            )
        }
        window.postMessage(message)
    }

    const handleMessage = <T extends keyof Events>(
        event: MessageEvent<string>
    ) => {
        if (typeof event.data !== "string") {
            return
        }

        const message = JSON.parse(event.data) as Event<T>

        switch (message.type) {
            case "element.create":
                context.events.emit(
                    "element.create",
                    message.data as DeepPartial<CanvasElement>
                )
                break
                
            case "element.create.default":
                context.events.emit(
                    "element.create.default",
                    message.data as CanvasElement["type"]
                )
                break

            case "canvas.render":
                postMessage({
                    id: message.id,
                    type: "canvas.render",
                    data: context.canvas
                })
                break

            case "canvas.clear":
                context.events.emit("canvas.clear", null)
                break

            default:
                console.warn(`Unsupported event: '${message.type}'`, message)
        }
    }

    useEffect(() => setDOMListeners(document, [
        ["message", handleMessage]
    ]))
}
