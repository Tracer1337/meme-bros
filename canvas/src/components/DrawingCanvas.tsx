import { useEffect, useRef } from "react"
import { addElement, useSharedContext } from "@meme-bros/client-lib"
import { setupDrawingCanvas } from "./utils/draw"
import { createCanvasElement } from "./utils/elements"

function DrawingCanvas() {
    const context = useSharedContext()

    const canvas = useRef<HTMLCanvasElement>(null)

    const handleDrawingDone = () => {
        createCanvasElement("image").then((element) => {
            if (!canvas.current) {
                return
            }
            element.data.uri = canvas.current.toDataURL()
            element.rect = {
                x: 0,
                y: 0,
                width: canvas.current.width,
                height: canvas.current.height,
                rotation: 0
            }
            context.events.emit("history.push")
            context.set({
                ...addElement(context, element),
                focus: null
            })
        })
    }

    useEffect(() => {
        if (canvas.current && context.drawing.isDrawing) {
            return setupDrawingCanvas({
                canvas: canvas.current,
                config: context.drawing,
                onDrawingDone: handleDrawingDone
            })
        }
        // eslint-disable-next-line
    }, [context])

    return (
        <canvas
            ref={canvas}
            style={{
                width: context.canvasDomRect?.width,
                height: context.canvasDomRect?.height,
                position: "absolute",
                zIndex: 10,
                pointerEvents: context.drawing.isDrawing
                    ? "all"
                    : "none",
                cursor: "crosshair"
            }}
        />
    )
}

export default DrawingCanvas
