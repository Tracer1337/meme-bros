import { Canvas, Rect } from "./types"

export function applyPixelRatio(canvas: Canvas) {
    const pr = canvas.pixelRatio || 1

    const scale = <T extends Record<string, any>>(
        obj: T,
        ...keys: (keyof T)[]
    ) => {
        keys.forEach((key) => {
            if (!Number.isNaN(obj[key])) {
                (obj[key] as number) *= pr
            }
        })
    }

    const scaleRect = (rect: Rect) =>
        scale(rect, "x", "y", "width", "height")

    scale(canvas, "width", "height")

    canvas.elements.map((element) => {
        switch (element.type) {
            case "image":
                scaleRect(element.rect)
                scale(element.data, "borderRadius")
                break
            case "textbox":
                scaleRect(element.rect)
                scale(element.data, "outlineWidth", "padding")
                break
            case "shape":
                scaleRect(element.rect)
                scale(element.data, "borderWidth")
                break
        }
    })
}
