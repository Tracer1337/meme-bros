import Joi from "joi"
import path from "path"
import {
    createCanvas,
    CanvasRenderingContext2D,
    registerFont
} from "canvas"
import { canvasValidator } from "./validation"
import { Canvas } from "./types"
import { applyPixelRatio } from "./utils"
import { Elements } from "./elements"

export async function render(json: string) {
    const canvas = JSON.parse(json) as Canvas
    Joi.assert(canvas, canvasValidator, {
        allowUnknown: canvas.debug
    })
    applyPixelRatio(canvas)
    FontRegistry.loadFonts()
    return await new RenderingContext(canvas).render()
}

class FontRegistry {
    private static readonly FONT_FAMILIES = ["Arial", "Comic-Sans", "Impact"]
    private static readonly FONT_WEIGHTS = ["normal", "bold"]

    public static loadFonts() {
        this.FONT_FAMILIES.forEach((family) =>
            this.FONT_WEIGHTS.forEach((weight) =>
                registerFont(
                    path.resolve(__dirname, "assets", "fonts", `${family}_${weight}.ttf`),
                    { family, weight }
                )
            )
        )
    }
}

class RenderingContext {
    private dc: CanvasRenderingContext2D
    private elements: Elements.Element[] = []

    constructor(private canvas: Canvas) {
        this.dc = createCanvas(canvas.width, canvas.height).getContext("2d")
        this.collectElements()
    }
    private collectElements() {
        this.elements.push(new Elements.Background())
        this.canvas.elements.forEach((element) => {
            switch (element.type) {
                case "image":
                    this.elements.push(new Elements.Image(element))
                    break
                case "textbox":
                    this.elements.push(new Elements.Textbox(element))
                    break
            }
        })
    }

    public async render() {
        for (let e of this.elements) {
            await e.draw(this.dc, this.canvas)
        }

        return this.dc.canvas.toDataURL()
    }
}
