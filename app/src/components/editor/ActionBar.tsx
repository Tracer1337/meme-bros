import React, { useEffect, useState } from "react"
import { Editor } from "@meme-bros/shared"
import { useSharedContext } from "@meme-bros/client-lib"
import CanvasActions from "./CanvasActions"
import TextboxElementActions from "./TextboxElementActions"
import ImageElementActions from "./ImageElementActions"
import DrawingActions from "./DrawingActions"

enum ActionBarMode {
    CANVAS,
    TEXTBOX_ELEMENT,
    IMAGE_ELEMENT,
    DRAWING
}

const elementModes: Record<Editor.CanvasElement["type"], ActionBarMode> = {
    "textbox": ActionBarMode.TEXTBOX_ELEMENT,
    "image": ActionBarMode.IMAGE_ELEMENT,
    "shape": ActionBarMode.CANVAS
}

const actionBars: Record<ActionBarMode, React.FunctionComponent> = {
    [ActionBarMode.CANVAS]: CanvasActions,
    [ActionBarMode.TEXTBOX_ELEMENT]: TextboxElementActions,
    [ActionBarMode.IMAGE_ELEMENT]: ImageElementActions,
    [ActionBarMode.DRAWING]: DrawingActions
}

function ActionBar() {    
    const context = useSharedContext()

    const [mode, setMode] = useState<ActionBarMode>(ActionBarMode.CANVAS)

    useEffect(() => {
        const element = context.canvas.elements[context.focus || -1]
        if (context.drawing.isDrawing) {
            setMode(ActionBarMode.DRAWING)
        } else if (context.focus === null) {
            setMode(ActionBarMode.CANVAS)
        } else {
            setMode(elementModes[element.type])
        }
    }, [context])

    return React.createElement(actionBars[mode])
}

export default ActionBar
