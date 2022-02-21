import React, { useRef, useContext } from "react"
import WebView from "react-native-webview"
import { DeepPartial } from "tsdef"
import produce from "immer"
import { Editor } from "@meme-bros/shared"
import {
    deepmerge,
    renderCanvas,
    SharedContext,
    updateCanvasBase,
    useModule,
    useRNWebViewMessaging,
    useSharedContext,
    useListeners
} from "@meme-bros/client-lib"
import * as API from "@meme-bros/api-sdk"
import { DialogContext } from "../../lib/DialogHandler"
import { useCanvasUtils } from "./utils/canvas"
import { useCanvasDummyLoader } from "./utils/dummy"
import { useCanvasScaling } from "./utils/scale"

const BLANK_SIZE = 500

function Canvas() {
    const context = useSharedContext()

    const core = useModule("core")
    const canvasMod = useModule("canvas")

    const dialogs = useContext(DialogContext)
    
    const canvas = useRef<WebView>(null)

    const { onMessage } = useRNWebViewMessaging(canvas)

    const { createCanvasElement } = useCanvasUtils()
    const loadCanvasDummy = useCanvasDummyLoader()
    const { scaleToScreen, scaleTemplateCanvas } = useCanvasScaling()

    const handleWebViewLoad = () => {
        context.events.emit("canvas.load")
    }

    const handleCanvasRender = async () => {
        if (!core?.render) {
            return
        }
        const rendered = renderCanvas(context.canvas)
        console.log("Generate", { raw: context.canvas, rendered })
        const base64 = await core.render(rendered)
        dialogs.open("GeneratedImageDialog", {
            uri: base64,
            width: context.canvas.width,
            height: context.canvas.height
        })
        context.events.emit("canvas.render.done")
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
        const canvas = await loadCanvasDummy()
        if (canvas) {
            context.set({ renderCanvas: true, canvas })
        }
    }

    const handleTemplateLoad = ({ template, canvas }: {
        template: API.Template,
        canvas: Editor.Canvas
    }) => {
        context.set({
            template,
            renderCanvas: true,
            canvas: produce(canvas, scaleTemplateCanvas)
        })
    }

    const handleStickersOpen = async () => {
        dialogs.open("StickersDialog", undefined)
    }

    useListeners(context.events, [
        ["canvas.render", handleCanvasRender],
        ["canvas.base.import", handleBaseImport],
        ["canvas.base.blank", handleBaseBlank],
        ["canvas.base.dummy", handleBaseDummy],
        ["template.load", handleTemplateLoad],
        ["stickers.open", handleStickersOpen]
    ])
    
    return (
        <WebView
            originWhitelist={["*"]}
            source={{ uri: canvasMod.uri }}
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
