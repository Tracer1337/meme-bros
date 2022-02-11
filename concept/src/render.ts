import path from "path"
import { registerFont } from "canvas"
import { Canvas } from "./canvas"
import { Drawable, DrawingContext, NewDrawingContext } from "./draw"

export class RenderingContext {
    public static NewRenderingContext(canvas: Canvas) {
        const rc = new RenderingContext()
        rc.canvas = canvas
        return rc
    }
    
    public canvas: Canvas

    public async render(index: number): Promise<DrawingContext> {
        this.loadFonts()
        
        const dc = this.newLayer()

        const drawables = this.canvas.elements as Drawable[]
        
        for (let e of drawables) {
            dc.save()
            await e.draw(this, dc, index)
            dc.restore()
        }

        return dc
    }

    private newLayer(): DrawingContext {
        return NewDrawingContext(this.canvas.width, this.canvas.height)
    }

    private loadFonts() {
        const fonts = ["Arial", "Comic-Sans", "Impact"]
        fonts.forEach((family) => {
            registerFont(
                path.resolve(__dirname, "assets", "fonts", `${family}_normal.ttf`),
                { family: family, weight: "normal" }
            )
            registerFont(
                path.resolve(__dirname, "assets", "fonts", `${family}_bold.ttf`),
                { family: family, weight: "bold" }
            )
        })
    }
}
