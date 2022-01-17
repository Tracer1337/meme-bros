import { Editor } from "@meme-bros/shared"
import { TemplateCanvas } from "../../templates/types"
import { Dimensions } from "../../../lib/dimensions"
import { ACTION_BAR_HEIGHT } from "../constants"

function getWidth(ratio: number) {
    let { width, height } = Dimensions.get("window")
    height -= ACTION_BAR_HEIGHT
    const maxWidth = width * 0.9
    const maxHeight = height * 0.9
    return width * ratio <= height ? maxWidth : maxHeight * (1 / ratio)
}

function scaleRect<
    T extends Record<K, Editor.Rect>,
    K extends keyof T
>(obj: T, key: K, width: number) {
    obj[key] = {
        ...obj[key],
        x: obj[key].x * width,
        y: obj[key].y * width,
        width: obj[key].width * width,
        height: obj[key].height * width
    }
}

export function scaleTemplateCanvas(canvas: TemplateCanvas) {
    const width = getWidth(canvas.height)
    const imageWidth = 500

    canvas.width = width
    canvas.height = canvas.height * width

    canvas.pixelRatio = Math.max(imageWidth / width, 1)

    if (canvas.base?.rect) {
        scaleRect(
            canvas.base as Required<Editor.CanvasBase>,
            "rect",
            width
        )
    }

    canvas.layers.forEach((id) => {
        scaleRect(canvas.elements[id], "rect", width)
    })

    return canvas
}

export function scaleToScreen(rect: { width: number, height: number }) {
    const ratio = rect.height / rect.width
    const width = getWidth(ratio)
    return {
        width: width,
        height: width * ratio
    }
}
