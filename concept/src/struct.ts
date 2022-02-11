import { RenderingContext } from "./render"
import { DrawingContext } from "./draw"

export interface Drawable {
    draw(rc: RenderingContext, dc: DrawingContext, i: number): Promise<void>
    getIndex(): number
    getType(): string
}

export interface Canvas {
    width: number
    height: number
    pixelRatio: number
    backgroundColor: string
    debug: boolean
    animated: boolean
    multiPalette: boolean
    elements: CanvasElements
    drawables: Drawable[]
}

export interface CanvasElements {
    images: ImageElement[]
}

export interface ImageElement extends Drawable {
    index: number
    rect: Rect
    data: ImageData
}

export interface ImageData {
    image: string
    borderRadius: number
}

export interface Rect {
    x: number
    y: number
    width: number
    height: number
    rotation: number

    applyRotation(dc: DrawingContext): void
    draw(dc: DrawingContext): void
}
