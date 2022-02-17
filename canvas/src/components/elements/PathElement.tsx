import { useEffect, useMemo, useRef } from "react"
import { updateElementData, useSharedContext } from "@meme-bros/client-lib"
import makeElement, { ElementProps } from "./makeElement"
import { setupDrawingCanvas } from "./utils/draw"

function PathElement({ element }: ElementProps<"path">) {
    const context = useSharedContext()

    const canvas = useRef<HTMLCanvasElement>(null)

    const isFocused = useMemo(
        () => context.interactions.focus === element.id,
        [context.interactions.focus, element.id]
    )

    useEffect(() => {
        if (canvas.current) {
            return setupDrawingCanvas({
                canvas: canvas.current,
                element,
                onUpdate: (paths) => {
                    context.events.emit("history.push")
                    context.set(updateElementData(
                        context,
                        element,
                        { ...element.data, paths }
                    ))
                }
            })
        }
        // eslint-disable-next-line
    }, [context, element])

    return (
        <canvas
            ref={canvas}
            style={{
                width: context.canvasDomRect?.width,
                height: context.canvasDomRect?.height,
                pointerEvents: isFocused ? "all" : "none",
                cursor: "crosshair"
            }}
        />
    )
}

export default makeElement(PathElement, () => ({
    interactive: false
}))
