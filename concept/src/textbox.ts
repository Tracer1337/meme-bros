import { Drawable, DrawingContext } from "./draw"
import { Rect } from "./rect"
import { RenderingContext } from "./render"

export interface TextboxData {
    text: string
    fontFamily: string
    fontWeight: string
    textAlign: string
    verticalAlign: string
    color: string
    caps: boolean
    outlineWidth: number
    outlineColor: string
    backgroundColor: string
    padding: number
}

export class TextboxElement implements Drawable {
    public rect: Rect
    public data: TextboxData
    
    public async draw(rc: RenderingContext, dc: DrawingContext) {
        const text = this.getTransformedText()
        dc.font = `32px "${this.data.fontFamily}" ${this.data.fontWeight}`
        dc.fillStyle = this.data.color
        dc.strokeStyle = this.data.outlineColor
        dc.fillText(text, this.rect.x, this.rect.y, this.rect.width)
        dc.fill()
        dc.strokeText(text, this.rect.x, this.rect.y, this.rect.width)
        dc.stroke()
    }

    private getTransformedText() {
        let text = this.data.text
        if (this.data.caps) {
            text = text.toUpperCase()
        }
        return text
    }
}
