import { useContext, useEffect } from "react"
import * as CSS from "csstype"
import { DialogContext } from "../../lib/DialogHandler"
import { consumeEvent, setListeners } from "../../lib/events"
import { PickElement } from "../../types"
import { CanvasContext, updateElementData } from "../Context"
import makeElement, { ElementProps } from "./makeElement"

export function getShapeDefaultData(): PickElement<"shape">["data"] {
    return {
        variant: "rect",
        backgroundColor: "transparent",
        borderColor: "#e74c3c",
        borderWidth: 5
    }
}

export function getShapeStyles(element: PickElement<"shape">): CSS.Properties {
    return {
        backgroundColor: element.data.backgroundColor,
        borderColor: element.data.borderColor,
        borderWidth: element.data.borderWidth + "px",
        borderStyle: "solid",
        borderRadius: element.data.variant === "ellipse" ? "50%" : undefined
    }
}

function Shape({ element }: ElementProps<"shape">) {
    const context = useContext(CanvasContext)
    const dialogs = useContext(DialogContext)
    
    const handleConfig = async () => {
        const data = await dialogs.open("ShapeConfigDialog", element)
        context.push()
        context.set(updateElementData(context, element, data))
    }

    useEffect(() =>
        setListeners(context.events, [
            ["element.config", consumeEvent(element.id, handleConfig)]
        ])
    )
    
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
