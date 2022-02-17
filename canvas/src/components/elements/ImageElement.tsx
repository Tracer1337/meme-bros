import { useContext } from "react"
import * as CSS from "csstype"
import { Editor } from "@meme-bros/shared"
import {
    updateElementData,
    updateElementRect,
    useSharedContext,
    deepmerge,
    consumeEvent,
    useListeners
} from "@meme-bros/client-lib"
import { DialogContext } from "../../lib/DialogHandler"
import makeElement, { ElementProps } from "./makeElement"

export function getImageStyles(element: Editor.PickElement<"image">): CSS.Properties {
    return {
        borderRadius: element.data.borderRadius + "px",
        userSelect: "none"
    }
}

function ImageElement({ element, size }: ElementProps<"image">) {
    const context = useSharedContext()

    const dialogs = useContext(DialogContext)

    const resetSize = () => {
        size.emit("update", {
            x: element.rect.width,
            y: element.rect.height
        })
        return updateElementRect(context, element, {
            ...element.rect,
            width: element.data.naturalWidth,
            height: element.data.naturalHeight
        })
    }

    const handleConfig = async () => {
        const data = await dialogs.open("ImageConfigDialog", element)
        context.events.emit("history.push")
        const partial = !element.data.keepAspectRatio && data.keepAspectRatio
            ? resetSize()
            : {}
        context.set(deepmerge(
            partial,
            updateElementData(context, element, data)
        ))
    }

    useListeners(context.events, [
        ["element.config", consumeEvent(element.id, handleConfig)]
    ])
    
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

export default makeElement(ImageElement, ({ element, context }) => ({
    interactive: context.canvas.base?.id !== element.id,
    interactions: {
        edit: false
    },
    aspectRatio: !element.data.keepAspectRatio
        ? undefined
        : element.rect.height / element.rect.width
}))
