import { useContext } from "react"
import * as CSS from "csstype"
import { Editor } from "@meme-bros/shared"
import {
    updateElementData,
    useSharedContext,
    consumeEvent,
    useListeners
} from "@meme-bros/client-lib"
import { DialogContext } from "../../lib/DialogHandler"
import makeElement, { ElementProps } from "./makeElement"

export function getShapeStyles(element: Editor.PickElement<"shape">): CSS.Properties {
    return {
        backgroundColor: element.data.backgroundColor,
        borderColor: element.data.borderColor,
        borderWidth: element.data.borderWidth + "px",
        borderStyle: "solid",
        borderRadius: element.data.variant === "ellipse" ? "50%" : undefined
    }
}

function Shape({ element }: ElementProps<"shape">) {
    const context = useSharedContext()

    const dialogs = useContext(DialogContext)
    
    const handleConfig = async () => {
        const data = await dialogs.open("ShapeConfigDialog", element)
        context.events.emit("history.push")
        context.set(updateElementData(context, element, data))
    }

    useListeners(context.events, [
        ["element.config", consumeEvent(element.id, handleConfig)]
    ])
    
    return (
        <div style={{
            ...getShapeStyles(element),
            width: "100%",
            height: "100%"
        }} />
    )
}

export default makeElement(Shape, () => ({
    interactions: {
        edit: false
    }
}))
