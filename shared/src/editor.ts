import * as Core from "@meme-bros/core"
import { OverwriteProps } from "tsdef"

export namespace Editor {
    export type Color = Core.ColorString
    export type Rect = Core.Rect

    export type PickElement<
        T extends CanvasElement["type"]
    > = Extract<CanvasElement, { type: T }>

    export type Canvas = OverwriteProps<Core.Canvas, {
        backgroundColor: Color,
        elements: Record<CanvasElement["id"], CanvasElement>,
        layers: CanvasElement["id"][]
    }>

    export type CanvasElement = Core.CanvasElementCommon & (
        ImageElement |
        TextboxElement |
        ShapeElement
    )

    export type ImageElement = OverwriteProps<
        Core.ImageElement,
        {
            data: OverwriteProps<Core.ImageElement["data"], {
                animated: boolean,
                keepAspectRatio: boolean,
                naturalWidth: number,
                naturalHeight: number
            }>
        }
    >

    export type TextboxElement = OverwriteProps<
        Core.TextboxElement,
        {
            data: OverwriteProps<Core.TextboxElement["data"], {
                color: Color,
                outlineColor: Color,
                backgroundColor: Color
            }>
        }
    >

    export type ShapeElement = OverwriteProps<
        Core.ShapeElement,
        {
            data: OverwriteProps<Core.ShapeElement["data"], {
                backgroundColor: Color,
                borderColor: Color
            }>
        }
    >
}

export function renderCanvas(editorCanvas: Editor.Canvas): Core.Canvas {
    return {
        ...editorCanvas,
        elements: editorCanvas.layers.map((id) => editorCanvas.elements[id])
    }
}
