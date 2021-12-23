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
import { loadCanvasDummy } from "./utils/dummy"
import { useBridge } from "./utils/useBridge"

const BLANK_SIZE = 500

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

const uri = process.env.NODE_ENV === "development"
    ? "http://10.0.2.2:3000"
    : "file:///android_asset/canvas/build/index.html"

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
        const canvas = await bridge.request("canvas.render", null)
        console.log("Generate", canvas)
        const base64 = await CoreModule.render(canvas)
        dialogs.open("GeneratedImageDialog", {
            uri: base64,
            width: canvas.width,
            height: canvas.height
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
        const pixelRatio = Math.max(newElement.data.naturalWidth / rect.width, 1)
        newElement.rect = { ...newElement.rect, ...rect }
        context.set({ renderCanvas: true })
        requestAnimationFrame(() => {
            bridge.request("canvas.set", {
                ...rect,
                pixelRatio,
                backgroundColor: "#ffffff",
                elements: [newElement]
            })
        })
    }

    const handleBaseBlank = async () => {
        const dim = scaleToScreen({
            width: BLANK_SIZE,
            height: BLANK_SIZE
        })
        context.set({ renderCanvas: true })
        requestAnimationFrame(() => {
            bridge.request("canvas.set", {
                ...dim,
                pixelRatio: BLANK_SIZE / dim.width,
                backgroundColor: "#ffffff"
            })
        })
    }

    const handleBaseDummy = async () => {
        const dummy = await loadCanvasDummy()
        context.set({ renderCanvas: true })
        requestAnimationFrame(() => {
            bridge.request("canvas.set", dummy)
        })
    }

    const handleCanvasClear = () => {
        context.set({ renderCanvas: false })
        bridge.request("canvas.set", { elements: [] })
    }

    const handleCanvasUndo = () => {
        bridge.request("canvas.undo", null)
    }
        
    useEffect(() =>
        setListeners(context.events, [
            ["element.create", handleElementCreate],
            ["canvas.render", handleCanvasRender],
            ["canvas.base.import", handleBaseImport],
            ["canvas.base.blank", handleBaseBlank],
            ["canvas.base.dummy", handleBaseDummy],
            ["canvas.clear", handleCanvasClear],
            ["canvas.undo", handleCanvasUndo]
        ])
    )

    return (
        <WebView
            originWhitelist={["*"]}
            source={{ uri }}
            ref={canvas}
            onMessage={bridge.onMessage}
            bounces={false}
            scrollEnabled={false}
            allowFileAccess
        />
    )
}

export default Canvas
