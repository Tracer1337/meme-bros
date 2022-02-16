import * as Core from "@meme-bros/core-types"
import { OverwriteProps } from "tsdef"

export namespace Editor {
    export type Color = Core.ColorString
    export type Rect = Core.Rect

    export enum CanvasMode {
        CLASSIC,
        BLANK,
    }

    export type PickElement<
        T extends CanvasElement["type"]
    > = Extract<CanvasElement, { type: T }>

    export type Canvas = OverwriteProps<Core.Canvas, {
        backgroundColor: Color,
        mode: CanvasMode,
        base?: CanvasBase,
        elements: Record<CanvasElement["id"], CanvasElement>,
        layers: CanvasElement["id"][]
    }>

    export type CanvasBase = {
        id: CanvasElement["id"],
        rounded: boolean,
        padding: boolean,
        rect?: Rect
    }

    export type CanvasElementCommon = Core.CanvasElementCommon

    export type CanvasElement = CanvasElementCommon & (
        ImageElement |
        TextboxElement |
        ShapeElement |
        PathElement
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

    export type PathElement = OverwriteProps<
        Core.PathElement,
        {
            data: OverwriteProps<Core.PathElement["data"], {
                color: Color
            }>
        }
    >
}

export function isImageElement(
    element: Editor.CanvasElement
): element is Editor.PickElement<"image"> {
    return element.type === "image"
}

export function isAnimatedCanvas(canvas: Editor.Canvas) {
    return canvas.layers.some((layer) => {
        const element = canvas.elements[layer]
        return isImageElement(element) && element.data.animated
    })
}

export function getFileExtensionForCanvas(canvas: Editor.Canvas) {
    return isAnimatedCanvas(canvas) ? "gif" : "png"
}
