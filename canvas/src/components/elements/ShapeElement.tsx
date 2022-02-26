import * as CSS from "csstype"
import { Editor } from "@meme-bros/shared"
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

function ShapeElement({ element }: ElementProps<"shape">) {
    return (
        <div style={{
            ...getShapeStyles(element),
            width: "100%",
            height: "100%"
        }} />
    )
}

export default makeElement(ShapeElement)
