import { useContext, useEffect } from "react"
import { DeepPartial } from "tsdef"
import * as Core from "@meme-bros/core"
import { setDOMListeners } from "../../lib/events"
import { CanvasContext } from "../Context"

type Events = {
    "element.create": DeepPartial<Core.CanvasElement>,
    "element.create.default": Core.CanvasElement["type"],
    "canvas.render": null,
    "canvas.undo": null,
    "canvas.set": DeepPartial<Core.Canvas>
}

type Responses = {
    "canvas.render": Core.Canvas
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
    const context = useContext(CanvasContext)

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
                
            case "canvas.set":
                context.set({ canvas: message.data as Events["canvas.set"] })
                break

            case "canvas.undo":
                context.pop()
                break;

            default:
                console.warn(`Unsupported event: '${message.type}'`, message)
        }
    }

    useEffect(() => setDOMListeners(document, [
        ["message", handleMessage]
    ]))
}
