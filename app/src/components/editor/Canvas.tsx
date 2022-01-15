import React, { useRef, useContext, useEffect } from "react"
import { Platform } from "react-native"
import WebView from "react-native-webview"
import { DeepPartial } from "tsdef"
import {
    deepmerge,
    Editor,
    renderCanvas,
    SharedContext,
    updateCanvasBase,
    useNativeModule,
    useRNWebViewMessaging,
    useSharedContext
} from "@meme-bros/shared"
import { DialogContext } from "../../lib/DialogHandler"
import { setListeners } from "../../lib/events"
import { loadCanvasDummy } from "./utils/dummy"
import { createCanvasElement, scaleToScreen } from "./utils/canvas"
import { scaleTemplateCanvas } from "../templates/utils/scale"

const BLANK_SIZE = 500

const uri = Platform.select({
    web: "http://localhost:8080/iframe",
    default: __DEV__
        ? "http://10.0.2.2:3000"
        : "file:///android_asset/canvas/build/index.html"
})

function Canvas() {
    const context = useSharedContext()

    const core = useNativeModule("core")

    const dialogs = useContext(DialogContext)
    
    const canvas = useRef<WebView>(null)

    const { onMessage } = useRNWebViewMessaging(canvas)

    const handleWebViewLoad = () => {
        context.events.emit("canvas.load", null)
    }

    const handleCanvasRender = async () => {
        const rendered = renderCanvas(context.canvas)
        console.log("Generate", { raw: context.canvas, rendered })
        const base64 = await core.render(rendered)
        dialogs.open("GeneratedImageDialog", {
            uri: base64,
            width: context.canvas.width,
            height: context.canvas.height
        })
        context.events.emit("canvas.render.done", null)
    }

    const handleBaseImport = async () => {
        const newElement = await createCanvasElement("image") as Editor.PickElement<"image">
        if (!newElement) {
            return
        }
        const rect = scaleToScreen({
            width: newElement.rect.width || 0,
            height: newElement.rect.height || 0
        })
        newElement.id = 0
        newElement.interactive = false
        newElement.rect = { ...newElement.rect, ...rect }
        const base: Editor.CanvasBase = {
            id: newElement.id,
            rounded: false,
            padding: false
        }
        const pixelRatio = Math.max(newElement.data.naturalWidth / rect.width, 1)
        const newContext = deepmerge<
            DeepPartial<SharedContext.ContextValue>
        >(context, {
            renderCanvas: true,
            canvas: {
                ...rect,
                pixelRatio,
                backgroundColor: "#ffffff",
                mode: Editor.CanvasMode.CLASSIC,
                base,
                elements: {
                    [newElement.id]: newElement
                },
                layers: [newElement.id]
            }
        }) as typeof context
        context.set(deepmerge<
            DeepPartial<SharedContext.ContextValue>
        >(
            newContext,
            updateCanvasBase(newContext, base)
        ))
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
                mode: Editor.CanvasMode.BLANK,
                pixelRatio: BLANK_SIZE / dim.width,
                backgroundColor: "#ffffff",
                layers: []
            }
        })
    }

    const handleBaseDummy = async () => {
        context.set({
            renderCanvas: true,
            canvas: await loadCanvasDummy()
        })
    }

    const handleTemplateLoad = (canvas: Editor.Canvas) => {
        context.set({
            renderCanvas: true,
            canvas: scaleTemplateCanvas(canvas)
        })
    }
        
    useEffect(() =>
        setListeners(context.events, [
            ["canvas.render", handleCanvasRender],
            ["canvas.base.import", handleBaseImport],
            ["canvas.base.blank", handleBaseBlank],
            ["canvas.base.dummy", handleBaseDummy],
            ["template.load", handleTemplateLoad]
        ])
    )

    return (
        <WebView
            originWhitelist={["*"]}
            source={{ uri }}
            ref={canvas}
            onMessage={onMessage}
            onLoad={handleWebViewLoad}
            bounces={false}
            scrollEnabled={false}
            allowFileAccess
        />
    )
}

export default Canvas
