import { Canvas, createCanvas } from "canvas"
import { RenderingContext } from "./render"

export type DrawingContext = ReturnType<Canvas["getContext"]>

export interface Drawable {
    draw(rc: RenderingContext, dc: DrawingContext, i: number): Promise<void>
}

export function NewDrawingContext(width: number, height: number) {
    return createCanvas(width, height).getContext("2d")
}
