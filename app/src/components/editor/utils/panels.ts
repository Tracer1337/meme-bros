import { useMemo } from "react"
import { Editor } from "@meme-bros/shared"
import { useSharedContext } from "@meme-bros/client-lib"
import { useFocusedElement } from "./canvas"

export enum ActionPanelModes {
    CANVAS,
    TEXTBOX_ELEMENT,
    IMAGE_ELEMENT,
    SHAPE_ELEMENT,
    DRAWING
}

const elementModes: Record<
    Editor.CanvasElement["type"],
    ActionPanelModes
> = {
    "textbox": ActionPanelModes.TEXTBOX_ELEMENT,
    "image": ActionPanelModes.IMAGE_ELEMENT,
    "shape": ActionPanelModes.SHAPE_ELEMENT
}

export function useActionPanel(
    panels: Record<ActionPanelModes, React.FunctionComponent>
) {
    const context = useSharedContext()

    const element = useFocusedElement()

    const mode = useMemo(() => {
        if (context.drawing.isDrawing) {
            return ActionPanelModes.DRAWING
        } else if (!element) {
            return ActionPanelModes.CANVAS
        } else {
            return elementModes[element.type]
        }
    }, [context, element])

    return panels[mode]
}
