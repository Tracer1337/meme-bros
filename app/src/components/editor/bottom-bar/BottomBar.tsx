import React from "react"
import { useSharedContext } from "@meme-bros/client-lib"
import CanvasActions from "./CanvasActions"
import TextboxElementActions from "./TextboxElementActions"
import ImageElementActions from "./ImageElementActions"
import ShapeElementActions from "./ShapeElementActions"
import DrawingActions from "./DrawingActions"
import { ActionPanelModes, useActionPanel } from "../utils/panels"

const panels: Record<ActionPanelModes, React.FunctionComponent> = {
    [ActionPanelModes.CANVAS]: CanvasActions,
    [ActionPanelModes.DRAWING]: DrawingActions,
    [ActionPanelModes.TEXTBOX_ELEMENT]: TextboxElementActions,
    [ActionPanelModes.IMAGE_ELEMENT]: ImageElementActions,
    [ActionPanelModes.SHAPE_ELEMENT]: ShapeElementActions
}

function BottomBar() {    
    const context = useSharedContext()
    
    const panel = useActionPanel(panels)

    return React.createElement(panel, { key: context.focus })
}

export default BottomBar
