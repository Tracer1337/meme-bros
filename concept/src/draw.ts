import { Canvas, createCanvas } from "canvas"
import { RenderingContext } from "./render"

export interface Drawable {
    draw(rc: RenderingContext, dc: DrawingContext, i: number): Promise<void>
}

export class DrawingContext {
    public static NewContext(width: number, height: number) {
        const dc = new DrawingContext()
        dc.c = createCanvas(width, height)
        dc.cc = dc.c.getContext("2d")
        return dc
    }
    
    public c: Canvas
    public cc: ReturnType<Canvas["getContext"]>
}
