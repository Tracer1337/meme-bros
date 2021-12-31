import { AnimatedValueXY } from "../../../lib/animation"

export function getElementBasePosition(
    canvasSize: AnimatedValueXY,
    elementSize: AnimatedValueXY
) {
    return {
        x: canvasSize.x.value / 2 - elementSize.x.value / 2,
        y: canvasSize.y.value - elementSize.y.value
    }
}
