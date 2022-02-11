import { CanvasRenderingContext2D, loadImage } from "canvas"
import {
    Canvas,
    ImageElement,
    TextboxElement,
    Rect as IRect
} from "./types"

export namespace Elements {
    export abstract class Element {
        abstract draw(dc: CanvasRenderingContext2D, canvas: Canvas): Promise<void>
    }
    
    export class Background extends Element {
        public async draw(dc: CanvasRenderingContext2D, canvas: Canvas) {
            dc.fillStyle = canvas.backgroundColor
            dc.fillRect(0, 0, canvas.width, canvas.height)
        }
    }
    
    export class Image extends Element {
        private rect: Rect

        constructor(private readonly el: ImageElement) {
            super()
            this.rect = new Rect(el.rect)
        }
    
        public async draw(dc: CanvasRenderingContext2D, canvas: Canvas) {
            this.rect.applyRotation(dc)
            this.drawBorderRadius(dc)
            await this.drawImage(dc)

            if (canvas.debug) {
                this.rect.draw(dc)
            }
        }

        private drawBorderRadius(dc: CanvasRenderingContext2D) {}
    
        private async drawImage(dc: CanvasRenderingContext2D) {
            const { data, rect } = this.el
            const image = await loadImage(data.uri)
            dc.drawImage(image, rect.x, rect.y, rect.width, rect.height)
        }
    }

    export class Textbox extends Element {
        private rect: Rect

        constructor(private readonly el: TextboxElement) {
            super()
            this.rect = new Rect(el.rect)
        }

        public async draw(dc: CanvasRenderingContext2D, canvas: Canvas) {
            this.rect.applyRotation(dc)
            this.drawText(dc)

            if (canvas.debug) {
                this.rect.draw(dc)
            }
        }

        private drawText(dc: CanvasRenderingContext2D) {
            const { data, rect } = this.el
            const text = this.getTransformedText()
            dc.font = `32px "${data.fontFamily}" ${data.fontWeight}`
            dc.fillStyle = data.color
            dc.fillText(text, rect.x, rect.y, rect.width)
        }

        private getTransformedText() {
            const { data } = this.el
            let text = data.text
            if (data.caps) {
                text = text.toUpperCase()
            }
            return text
        }
    }

    export class Rect extends Element {
        constructor(private readonly el: IRect) {
            super()
        }

        public applyRotation(dc: CanvasRenderingContext2D): void {
            dc.rotate(this.el.rotation)
        }

        public async draw(dc: CanvasRenderingContext2D) {
            const { x, y, width, height } = this.el
            dc.strokeStyle = "rgb(0, 255, 0)"
            dc.lineWidth = 2
            dc.strokeRect(x, y, width, height)
        }
    }
}
