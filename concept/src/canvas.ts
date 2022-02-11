import { RenderingContext } from "./render"
import { ImageElement } from "./image"

export type CanvasElement = ImageElement

export class Canvas {
    public width: number
    public height: number
    public pixelRatio: number
    public backgroundColor: string
    public debug: boolean
    public animated: boolean
    public multiPalette: boolean
    public elements: CanvasElement[]

    public async render() {
        const dc = await RenderingContext.NewRenderingContext(this).render(0)
        return dc.c.toDataURL()
    }
}
