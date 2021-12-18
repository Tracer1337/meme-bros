import { RefObject, useRef } from "react"
import WebView, { WebViewMessageEvent } from "react-native-webview"
import { DeepPartial } from "tsdef"
import { Canvas, CanvasElement } from "../../../types"

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

function makeId() {
    return Math.floor(Math.random() * 1e8)
}

export function useBridge(webview: RefObject<WebView>) {
    const resolvers = useRef<Record<number, (data: any) => void>>({}).current

    const onMessage = (event: WebViewMessageEvent) => {
        const data = JSON.parse(event.nativeEvent.data) as Event<any>
        if (data.id in resolvers) {
            resolvers[data.id](data.data)
            delete resolvers[data.id]
        }
    }

    const request = <T extends keyof Events>(type: T, data: Events[T]) => {
        return new Promise<
            T extends keyof Responses ? Responses[T] : void
        >(async (resolve) => {
            let message: Event<any> | undefined
            switch (type) {
                case "element.create":
                    await emitElementCreate(data as Events["element.create"])
                    break
    
                case "canvas.render":
                    message = emitCanvasRender()
                    break

                case "canvas.clear":
                    emitCanvasClear()
                    break

                case "canvas.dimensions.set":
                    emitCanvasDimensionsSet(data as Events["canvas.dimensions.set"])
                    break

                default:
                    console.warn(`Unknown event: '${type}'`)
            }
            if (!message) {
                return
            }
            resolvers[message.id] = resolve
        })
    }

    const emitElementCreate = async (partial: DeepPartial<CanvasElement>) => {
        if (!webview.current) {
            return
        }
        if (!partial.type) {
            throw new Error("Element type is not defined in 'element.create'")
        }
        const message: Event<"element.create"> = {
            id: makeId(),
            type: "element.create",
            data: partial
        }
        webview.current.postMessage(JSON.stringify(message))
        return message
    }

    const emitCanvasRender = () => {
        if (!webview.current) {
            return
        }
        const message: Event<"canvas.render"> = {
            id: makeId(),
            type: "canvas.render",
            data: null
        }
        webview.current.postMessage(JSON.stringify(message))
        return message
    }

    const emitCanvasClear = () => {
        if (!webview.current) {
            return
        }
        const message: Event<"canvas.clear"> = {
            id: makeId(),
            type: "canvas.clear",
            data: null
        }
        webview.current.postMessage(JSON.stringify(message))
        return message
    }

    const emitCanvasDimensionsSet = (data: Events["canvas.dimensions.set"]) => {
        if (!webview.current) {
            return
        }
        const message: Event<"canvas.dimensions.set"> = {
            id: makeId(),
            type: "canvas.dimensions.set",
            data
        }
        webview.current.postMessage(JSON.stringify(message))
        return message
    }

    return { onMessage, request }
}
