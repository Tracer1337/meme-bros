import { useModule } from "@meme-bros/client-lib"
import { Editor } from "@meme-bros/shared"
import { ACTION_BAR_HEIGHT } from "../constants"

export function useCanvasScaling() {
    const dimensions = useModule("view").useDimensions()

    const getWidth = (ratio: number) => {
        let { width, height } = dimensions
        height -= ACTION_BAR_HEIGHT
        const maxWidth = width * 0.9
        const maxHeight = height * 0.9
        return width * ratio <= height ? maxWidth : maxHeight * (1 / ratio)
    }
    
    const scaleRect = <
        T extends Record<K, Editor.Rect>,
        K extends keyof T
    >(obj: T, key: K, width: number) => {
        obj[key] = {
            ...obj[key],
            x: obj[key].x * width,
            y: obj[key].y * width,
            width: obj[key].width * width,
            height: obj[key].height * width
        }
    }
    
    const scaleTemplateCanvas = (canvas: Editor.Canvas) => {
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
    
    const scaleToScreen = (rect: { width: number, height: number }) => {
        const ratio = rect.height / rect.width
        const width = getWidth(ratio)
        return {
            width: width,
            height: width * ratio
        }
    }
    
    return {
        scaleTemplateCanvas,
        scaleToScreen
    }
}
