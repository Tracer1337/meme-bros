import { DrawingContext } from "./draw"
import { Rect as IRect } from "./struct"

export class Rect implements IRect {
    public x: number
    public y: number
    public width: number
    public height: number
    public rotation: number

    applyRotation(dc: DrawingContext): void {
        dc.cc.rotate(this.rotation)
    }

    draw(dc: DrawingContext): void {
        dc.cc.rect(this.x, this.y, this.width, this.height)
    }
}
