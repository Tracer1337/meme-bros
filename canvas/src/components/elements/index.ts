import { Editor } from "@meme-bros/shared"
import { ElementComponentProps } from "./makeElement"
import ImageElement from "./ImageElement"
import ShapeElement from "./ShapeElement"
import TextboxElement from "./TextboxElement"

const elementsMap: Record<
    Editor.CanvasElement["type"],
    React.ComponentType<any>
> = {
    "textbox": TextboxElement,
    "image": ImageElement,
    "shape": ShapeElement
}

export function getElementByType<T extends Editor.CanvasElement["type"]>(
    type: T
): React.ComponentType<ElementComponentProps<T>> {
    return elementsMap[type]
}
