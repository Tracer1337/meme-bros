import { Canvas, createCanvas } from "canvas"

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
