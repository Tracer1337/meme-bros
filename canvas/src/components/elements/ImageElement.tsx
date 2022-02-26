import * as CSS from "csstype"
import { Editor } from "@meme-bros/shared"
import makeElement, { ElementProps } from "./makeElement"

export function getImageStyles(element: Editor.PickElement<"image">): CSS.Properties {
    return {
        borderRadius: element.data.borderRadius + "px",
        userSelect: "none"
    }
}

function ImageElement({ element }: ElementProps<"image">) {
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
    aspectRatio: !element.data.keepAspectRatio
        ? undefined
        : element.rect.height / element.rect.width
}))
