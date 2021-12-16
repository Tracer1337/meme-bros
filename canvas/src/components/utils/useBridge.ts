import { useContext, useEffect } from "react"
import { setDOMListeners } from "../../lib/events"
import { CanvasElement } from "../../types"
import { EditorContext } from "../Context"

type Events = {
    "element.create": CanvasElement["type"],
    "canvas.render": null
}

type Message<T extends keyof Events> = {
    target: "@meme-bros/canvas"
    data: {
        type: T,
        data: Events[T]
    }
}

export function useBridge() {
    const context = useContext(EditorContext)

    const handleMessage = <T extends keyof Events>(
        event: MessageEvent<Message<T>>
    ) => {
        if (event.data?.target !== "@meme-bros/canvas") {
            return
        }

        const message = event.data.data

        switch (message.type) {
            case "element.create":
                context.events.emit(
                    "element.create",
                    message.data as CanvasElement["type"]
                )
                break

            case "canvas.render":
                window.postMessage({
                    type: "response:canvas.render",
                    data: context.canvas
                })
                break

            default:
                console.warn(`Unsupported event: '${message.type}'`, message)
        }
    }

    useEffect(() => setDOMListeners(window, [
        ["message", handleMessage]
    ]))
}
