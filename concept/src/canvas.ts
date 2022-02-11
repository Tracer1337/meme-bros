import { RenderingContext } from "./render"
import {
    Canvas as ICanvas,
    CanvasElements as ICanvasElements,
    Drawable
} from "./struct"

export class Canvas implements ICanvas {
    public width: number
    public height: number
    public pixelRatio: number
    public backgroundColor: string
    public debug: boolean
    public animated: boolean
    public multiPalette: boolean
    public elements: ICanvasElements
    public drawables: Drawable[]

    public async render() {
        const dc = await RenderingContext.NewRenderingContext(this).render(0)
        return dc.c.toDataURL()
    }
}
