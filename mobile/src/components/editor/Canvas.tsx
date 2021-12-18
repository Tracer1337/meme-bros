import React, { useRef } from "react"
import { useContext } from "react"
import { useEffect } from "react"
import WebView from "react-native-webview"
import { DeepPartial } from "tsdef"
import CoreModule from "../../lib/CoreModule"
import { DialogContext } from "../../lib/DialogHandler"
import { setListeners } from "../../lib/events"
import { importImage } from "../../lib/media"
import { CanvasElement } from "../../types"
import { EditorContext } from "./Context"
import { renderCanvasState } from "./utils/render"
import { useBridge } from "./utils/useBridge"

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

    const handleBaseImport = () => {
        context.events.emit("element.create", "image")
    }

    const handleBaseBlank = () => {
        context.events.emit("element.create", "shape")
    }

    const handleCanvasClear = () => {
        context.set({ renderCanvas: false })
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
