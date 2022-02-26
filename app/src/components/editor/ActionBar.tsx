import React, { useEffect, useState } from "react"
import { useSharedContext } from "@meme-bros/client-lib"
import CanvasActions from "./CanvasActions"
import ElementActions from "./ElementActions"
import DrawingActions from "./DrawingActions"

enum ActionBarMode {
    CANVAS,
    ELEMENT,
    DRAWING
}

const actionBars: Record<ActionBarMode, React.FunctionComponent> = {
    [ActionBarMode.CANVAS]: CanvasActions,
    [ActionBarMode.ELEMENT]: ElementActions,
    [ActionBarMode.DRAWING]: DrawingActions
}

function ActionBar() {    
    const context = useSharedContext()

    const [mode, setMode] = useState<ActionBarMode>(ActionBarMode.CANVAS)

    useEffect(() => {
        if (context.drawing.isDrawing) {
            setMode(ActionBarMode.DRAWING)
        } else if (context.focus === null) {
            setMode(ActionBarMode.CANVAS)
        } else {
            setMode(ActionBarMode.ELEMENT)
        }
    }, [context])

    return React.createElement(actionBars[mode])
}

export default ActionBar
