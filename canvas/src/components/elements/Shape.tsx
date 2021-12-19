import { useContext, useEffect } from "react"
import { DialogContext } from "../../lib/DialogHandler"
import { consumeEvent, setListeners } from "../../lib/events"
import { PickElement } from "../../types"
import { CanvasContext } from "../Context"
import makeElement, { ElementProps } from "./makeElement"

export function getShapeDefaultData(): PickElement<"shape">["data"] {
    return {
        variant: "rect",
        backgroundColor: "transparent",
        borderColor: "#e74c3c",
        borderWidth: 5
    }
}

export function getShapeStyles(element: PickElement<"shape">) {
    return {
        backgroundColor: element.data.backgroundColor,
        borderColor: element.data.borderColor,
        borderWidth: element.data.borderWidth,
        borderStyle: "solid",
        borderRadius: element.data.variant === "ellipse" ? "50%" : undefined
    }
}

function Shape({ element }: ElementProps<"shape">) {
    const context = useContext(CanvasContext)
    const dialogs = useContext(DialogContext)
    
    const handleConfig = async () => {
        element.data = await dialogs.open("ShapeConfigDialog", element)
        context.set({})
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
