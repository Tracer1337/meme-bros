import React, { useContext, useEffect } from "react"
import { Animated } from "react-native"
import { toRGBAString } from "../../../lib/color"
import { DialogContext } from "../../../lib/DialogHandler"
import { consumeEvent, setListeners } from "../../../lib/events"
import { PickElement } from "../../../types"
import { EditorContext } from "../Context"
import makeElement, { ElementProps } from "./makeElement"

export const shapeDefaultData: PickElement<"shape">["data"] = {
    variant: "rect",
    backgroundColor: [0, 0, 0, 0],
    borderColor: [255, 0, 0, 255],
    borderWidth: 5
}

export function getShapeStyles(element: PickElement<"shape">) {
    return {
        backgroundColor: toRGBAString(element.data.backgroundColor),
        borderColor: toRGBAString(element.data.borderColor),
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
