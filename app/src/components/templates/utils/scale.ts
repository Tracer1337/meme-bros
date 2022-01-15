import { Editor } from "@meme-bros/shared"
import { TemplateCanvas } from "../types"
import { Dimensions } from "../../../lib/dimensions"

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
    const width = Dimensions.get("window").width * 0.9
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