import { useContext, useEffect } from "react"
import { DeepPartial } from "tsdef"
import { setDOMListeners } from "../../lib/events"
import { Canvas, CanvasElement } from "../../types"
import { EditorContext } from "../Context"

type Events = {
    "element.create": DeepPartial<CanvasElement>,
    "element.create.default": CanvasElement["type"],
    "canvas.render": null,
    "canvas.clear": null,
    "canvas.dimensions.set": Pick<Canvas, "width" | "height">
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
                    message.data as Events["element.create"]
                )
                break
                
            case "element.create.default":
                context.events.emit(
                    "element.create.default",
                    message.data as Events["element.create.default"]
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

            case "canvas.dimensions.set":
                context.events.emit(
                    "canvas.dimensions.set",
                    message.data as Events["canvas.dimensions.set"]
                )
                break

            default:
                console.warn(`Unsupported event: '${message.type}'`, message)
        }
    }

    useEffect(() => setDOMListeners(document, [
        ["message", handleMessage]
    ]))
}
