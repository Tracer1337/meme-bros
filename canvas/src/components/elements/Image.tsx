import { useContext, useEffect } from "react"
import * as CSS from "csstype"
import { DialogContext } from "../../lib/DialogHandler"
import { consumeEvent, setListeners } from "../../lib/events"
import { PickElement } from "../../types"
import { CanvasContext, updateElementData } from "../Context"
import makeElement, { ElementProps } from "./makeElement"

export function getImageDefaultData(): PickElement<"image">["data"] {
    return {
        uri: "https://via.placeholder.com/200x100",
        animated: false,
        loop: true,
        borderRadius: 0,
        keepAspectRatio: true,
        naturalWidth: 0,
        naturalHeight: 0
    }
}

export function getImageStyles(element: PickElement<"image">): CSS.Properties {
    return {
        borderRadius: element.data.borderRadius + "px",
        userSelect: "none"
    }
}

function Image({ element, size }: ElementProps<"image">) {
    const context = useContext(CanvasContext)
    const dialogs = useContext(DialogContext)

    const resetSize = () => {
        element.rect.width = element.data.naturalWidth
        element.rect.height = element.data.naturalHeight
        size.emit("update", {
            x: element.rect.width,
            y: element.rect.height
        })
    }

    const handleConfig = async () => {
        const data = await dialogs.open("ImageConfigDialog", element)
        if (!element.data.keepAspectRatio && data.keepAspectRatio) {
            resetSize()
        }
        context.push()
        context.set(updateElementData(context, element, data))
    }

    useEffect(() =>
        setListeners(context.events, [
            ["element.config", consumeEvent(element.id, handleConfig)]
        ])
    )
    
    return (
        <img
            src={element.data.uri}
            alt=""
            draggable={false}
            style={{
                ...getImageStyles(element),
                width: "100%",
                height: "100%"
            }}
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
