import React, { useRef } from "react"
import { useContext } from "react"
import { useEffect } from "react"
import { Dimensions } from "react-native"
import WebView from "react-native-webview"
import { DeepPartial } from "tsdef"
import CoreModule from "../../lib/CoreModule"
import { DialogContext } from "../../lib/DialogHandler"
import { setListeners } from "../../lib/events"
import { importImage } from "../../lib/media"
import { CanvasElement, PickElement } from "../../types"
import { EditorContext } from "./Context"
import { renderCanvasState } from "./utils/render"
import { useBridge } from "./utils/useBridge"

async function createPartialElement(type: CanvasElement["type"]) {
    const newElement: DeepPartial<CanvasElement> = {
        type,
        rect: {},
        data: {}
    }
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

function scaleToScreen(rect: { width: number, height: number }) {
    const width = Dimensions.get("window").width * 0.9
    return {
        width: width,
        height: width / rect.width * rect.height    
    }
}

function Canvas() {
    const context = useContext(EditorContext)
    const dialogs = useContext(DialogContext)
    
    const canvas = useRef<WebView>(null)

    const bridge = useBridge(canvas)

    const handleElementCreate = async (type: CanvasElement["type"]) => {
        const partial = await createPartialElement(type)
        if (!partial) {
            return
        }
        bridge.request("element.create", partial)
    }

    const handleCanvasRender = async () => {
        const state = await bridge.request("canvas.render", null)
        const rendered = renderCanvasState(state)
        console.log("Generate", rendered)
        const base64 = await CoreModule.render(rendered)
        dialogs.open("GeneratedImageDialog", {
            uri: base64,
            width: state.width,
            height: state.height
        })
        context.events.emit("canvas.render.done", null)
    }

    const handleBaseImport = async () => {
        const newElement = await createPartialElement("image") as PickElement<"image">
        if (!newElement) {
            return
        }
        newElement.id = 0
        const rect = scaleToScreen({
            width: newElement.rect.width || 0,
            height: newElement.rect.height || 0
        })
        newElement.rect = { ...newElement.rect, ...rect }
        context.set({ renderCanvas: true })
        requestAnimationFrame(() => {
            bridge.request("canvas.set", { ...rect, elements: [newElement] })
        })
    }

    const handleBaseBlank = async () => {
        const dim = scaleToScreen({
            width: 500,
            height: 500
        })
        context.set({ renderCanvas: true })
        requestAnimationFrame(() => {
            bridge.request("canvas.set", dim)
        })
    }

    const handleCanvasClear = () => {
        context.set({ renderCanvas: false })
        bridge.request("canvas.set", { elements: [] })
    }
        
    useEffect(() =>
        setListeners(context.events, [
            ["element.create", handleElementCreate],
            ["canvas.render", handleCanvasRender],
            ["canvas.base.import", handleBaseImport],
            ["canvas.base.blank", handleBaseBlank],
            ["canvas.clear", handleCanvasClear]
        ])
    )

    return (
        <WebView
            originWhitelist={["*"]}
            source={{ uri: "http://10.0.2.2:3000" }}
            ref={canvas}
            onMessage={bridge.onMessage}
            bounces={false}
            scrollEnabled={false}
        />
    )
}

export default Canvas
