import React, { useRef, useContext, useEffect } from "react"
import { Dimensions } from "react-native"
import WebView from "react-native-webview"
import { DeepPartial } from "tsdef"
import * as Core from "@meme-bros/core"
import { SharedContext, useRNWebViewMessaging, useSharedContext } from "@meme-bros/shared"
import CoreModule from "../../lib/CoreModule"
import { DialogContext } from "../../lib/DialogHandler"
import { setListeners } from "../../lib/events"
import { importImage } from "../../lib/media"
import { loadCanvasDummy } from "./utils/dummy"

const BLANK_SIZE = 500

async function createPartialElement(type: Core.CanvasElement["type"]) {
    const newElement: DeepPartial<Core.CanvasElement> = {
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
    const context = useSharedContext()

    const dialogs = useContext(DialogContext)
    
    const canvas = useRef<WebView>(null)
    
    const { onMessage } = useRNWebViewMessaging(canvas)

    const handleElementCreate = async ({
        type
    }: SharedContext.Events["element.create"]) => {
        if (!type) {
            return
        }
        const partial = await createPartialElement(type)
        if (!partial) {
            return
        }
        context.events.emit("element.create", partial)
    }

    const handleCanvasRender = async () => {
        console.log("Generate", canvas)
        const base64 = await CoreModule.render(context.canvas)
        dialogs.open("GeneratedImageDialog", {
            uri: base64,
            width: context.canvas.width,
            height: context.canvas.height
        })
        context.events.emit("canvas.render.done", null)
    }

    const handleBaseImport = async () => {
        const newElement = await createPartialElement("image") as Core.PickElement<"image">
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
        context.set({
            renderCanvas: true,
            canvas: {
                ...rect,
                pixelRatio,
                backgroundColor: "#ffffff",
                elements: [newElement]
            }
        })
    }

    const handleBaseBlank = async () => {
        const dim = scaleToScreen({
            width: BLANK_SIZE,
            height: BLANK_SIZE
        })
        context.set({
            renderCanvas: true,
            canvas: {
                ...dim,
                pixelRatio: BLANK_SIZE / dim.width,
                backgroundColor: "#ffffff"
            }
        })
    }

    const handleBaseDummy = async () => {
        context.set({
            renderCanvas: true,
            canvas: await loadCanvasDummy()
        })
    }
        
    useEffect(() =>
        setListeners(context.events, [
            ["element.create", handleElementCreate],
            ["canvas.render", handleCanvasRender],
            ["canvas.base.import", handleBaseImport],
            ["canvas.base.blank", handleBaseBlank],
            ["canvas.base.dummy", handleBaseDummy]
        ])
    )

    return (
        <WebView
            originWhitelist={["*"]}
            source={{ uri }}
            ref={canvas}
            onMessage={onMessage}
            bounces={false}
            scrollEnabled={false}
            allowFileAccess
        />
    )
}

export default Canvas
