import { Canvas } from "./canvas"
import { DrawingContext } from "./draw"

export class RenderingContext {
    public static NewRenderingContext(canvas: Canvas) {
        const rc = new RenderingContext()
        rc.canvas = canvas
        return rc
    }
    
    public canvas: Canvas

    public async render(index: number): Promise<DrawingContext> {
        const dc = this.newLayer()
        
        await Promise.all(
            this.canvas.elements.map(async (e) => {
                dc.cc.save()
                await e.draw(this, dc, index)
                dc.cc.restore()
            })
        )

        return dc
    }

    private newLayer(): DrawingContext {
        return DrawingContext.NewContext(this.canvas.width, this.canvas.height)
    }
}
