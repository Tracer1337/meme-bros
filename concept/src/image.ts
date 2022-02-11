import { loadImage } from "canvas"
import { DrawingContext } from "./draw"
import { RenderingContext } from "./render"
import { ImageElement as IImageElement, ImageData, Rect } from "./struct"

export class ImageElement implements IImageElement {
    public index: number
    public rect: Rect
    public data: ImageData
    
    public getIndex() {
        return this.index
    }

    public getType() {
        return "image"
    }

    public async draw(rc: RenderingContext, dc: DrawingContext, i: number) {
        this.rect.applyRotation(dc)
        this.drawBorderRadius(rc, dc)
        await this.drawImage(rc, dc)

        if (rc.canvas.debug) {
            this.rect.draw(dc)
        }
    }

    private drawBorderRadius(rc: RenderingContext, dc: DrawingContext) {

    }

    private async drawImage(rc: RenderingContext, dc: DrawingContext) {
        const image = await loadImage(this.data.image)
        dc.cc.drawImage(image, this.rect.x, this.rect.x, this.rect.width, this.rect.height)
    }
}
