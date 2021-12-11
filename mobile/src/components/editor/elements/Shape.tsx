import React, { useContext, useEffect } from "react"
import { Animated } from "react-native"
import { DialogContext } from "../../../lib/DialogHandler"
import { consumeEvent, setListeners } from "../../../lib/events"
import { PickElement } from "../../../types"
import { EditorContext } from "../Context"
import makeElement, { ElementProps } from "./makeElement"

export function getShapeDefaultData(): PickElement<"shape">["data"] {
    return {
        variant: "rect",
        backgroundColor: "transparent",
        borderColor: "#ff0000",
        borderWidth: 5
    }
}

export function getShapeStyles(element: PickElement<"shape">) {
    return {
        backgroundColor: element.data.backgroundColor,
        borderColor: element.data.borderColor,
        borderWidth: element.data.borderWidth
    }
}

function Shape({ element, size }: ElementProps<"shape">) {
    const context = useContext(EditorContext)
    const dialogs = useContext(DialogContext)
    
    const handleConfig = async () => {
        element.data = await dialogs.openDialog("ShapeConfigDialog", element)
        context.set({})
    }

    useEffect(() =>
        setListeners(context.events, [
            ["element.config", consumeEvent(element.id, handleConfig)]
        ])
    )

    const shapeStyles = getShapeStyles(element)
    
    return (
        <Animated.View
            style={[shapeStyles, {
                width: size.x,
                height: size.y
            }]}
        />
    )
}

export default makeElement(Shape, () => ({
    interactions: {
        edit: false
    }
}))
