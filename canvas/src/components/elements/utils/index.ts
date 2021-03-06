import { Editor } from "@meme-bros/shared"
import { BASE_PADDING } from "@meme-bros/client-lib"
import { AnimatedValueXY } from "../../../lib/animation"

export function getElementBasePosition(
    base: Editor.CanvasBase,
    canvasSize: AnimatedValueXY,
    elementSize: AnimatedValueXY
) {
    const padding = base.padding ? BASE_PADDING : 0
    return {
        x: canvasSize.x.value / 2 - elementSize.x.value / 2,
        y: canvasSize.y.value - elementSize.y.value - padding
    }
}
