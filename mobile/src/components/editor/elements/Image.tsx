import React, { useContext, useEffect } from "react"
import { Animated } from "react-native"
import { DialogContext } from "../../../lib/DialogHandler"
import { consumeEvent, setListeners } from "../../../lib/events"
import { PickElement } from "../../../types"
import { EditorContext } from "../Context"
import makeElement, { ElementProps } from "./makeElement"

export function getImageDefaultData(): PickElement<"image">["data"] {
    return {
        uri: "",
        animated: false,
        loop: true,
        borderRadius: 0,
        keepAspectRatio: true,
        naturalWidth: 0,
        naturalHeight: 0
    }
}

export function getImageStyles(element: PickElement<"image">) {
    return {
        borderRadius: element.data.borderRadius
    }
}

function Image({ element, size }: ElementProps<"image">) {
    const context = useContext(EditorContext)
    const dialogs = useContext(DialogContext)

    const resetSize = () => {
        element.rect.width = element.data.naturalWidth
        element.rect.height = element.data.naturalHeight
        size.setValue({
            x: element.rect.width,
            y: element.rect.height
        })
    }

    const handleConfig = async () => {
        const newData = await dialogs.openDialog("ImageConfigDialog", element)
        if (!element.data.keepAspectRatio && newData.keepAspectRatio) {
            resetSize()
        }
        element.data = newData
        context.set({})
    }

    useEffect(() =>
        setListeners(context.events, [
            ["element.config", consumeEvent(element.id, handleConfig)]
        ])
    )

    const imageStyles = getImageStyles(element)
    
    return (
        <Animated.Image
            source={{
                uri: element.data.uri,
                width: element.rect.width,
                height: element.rect.height
            }}
            resizeMode="stretch"
            width={size.x}
            height={size.y}
            style={imageStyles}
        />
    )
}

export default makeElement(Image, ({ element }) => ({
    focusable: element.id !== 0,
    interactions: {
        edit: false
    },
    aspectRatio: !element.data.keepAspectRatio
        ? undefined
        : element.rect.height / element.rect.width
}))
