import React, { useRef } from "react"
import { useContext } from "react"
import { useEffect } from "react"
import WebView from "react-native-webview"
import CoreModule from "../../lib/CoreModule"
import { DialogContext } from "../../lib/DialogHandler"
import { setListeners } from "../../lib/events"
import { ContextValue, EditorContext } from "./Context"
import { renderCanvasState } from "./utils/render"
import { useBridge } from "./utils/useBridge"

function Canvas() {
    const context = useContext(EditorContext)
    const dialogs = useContext(DialogContext)
    
    const canvas = useRef<WebView>(null)

    const { onMessage, events } = useBridge(canvas)

    const handleCanvasRender = async (state: ContextValue["canvas"]) => {
        const rendered = renderCanvasState(state)
        console.log("Generate", rendered)
        const base64 = await CoreModule.render(rendered)
        dialogs.open("GeneratedImageDialog", {
            uri: base64,
            width: context.canvas.width,
            height: context.canvas.height
        })
        context.events.emit("canvas.render.done", state)
    }

    useEffect(() =>
        setListeners(events, [
            ["canvas.render", handleCanvasRender]
        ])
    )

    return (
        <WebView
            originWhitelist={["*"]}
            source={{ uri: "http://10.0.2.2:3000" }}
            ref={canvas}
            onMessage={onMessage}
        />
    )
}

export default Canvas
