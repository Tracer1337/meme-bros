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
        const dc = this.newLayer()

        const drawables = this.canvas.elements as Drawable[]
        
        await Promise.all(drawables.map(async (e) => {
            dc.save()
            await e.draw(this, dc, index)
            dc.restore()
        }))

        return dc
    }

    private newLayer(): DrawingContext {
        return NewDrawingContext(this.canvas.width, this.canvas.height)
    }
}
