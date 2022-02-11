import { Canvas, CanvasElement } from "./canvas"
import { ImageElement } from "./image"
import { Rect } from "./rect"

function max(input: any, max: number) {
    return Number.isNaN(input) ? max : Math.max(input, max)
}

function parseRGBA(input: any) {
    return typeof input !== "string" ? "" : input
}

export function canvasFromJSON(json: string) {
    const obj = JSON.parse(json)
    return new ParsingContext().parseCanvas(obj)
}

class ParsingContext {
    private obj: Record<any, any> = {}
    private pr = 0

    public parseCanvas(obj: any) {
        if (typeof obj !== "object") {
            throw new Error()
        }
        this.obj = obj
        this.pr = this.obj.pixelRatio
        if (!this.pr) {
            this.pr = 1
        }
        const c = new Canvas()
        c.width = max(this.obj.width, 1) * this.pr
        c.height = max(this.obj.height, 1) * this.pr
        c.backgroundColor = parseRGBA(this.obj.backgroundColor)
        c.pixelRatio = this.pr
        c.debug = Boolean(this.obj.debug)
        c.multiPalette = Boolean(this.obj.multiPalette)
        c.elements = this.parseElements()
        c.animated = false
        return c
    }

    private parseElements() {
        if (!("elements" in this.obj) || !Array.isArray(this.obj.elements)) {
            return
        }
        const elements: CanvasElement[] = []
        this.obj.elements.map((element) => {
            if (!(typeof element === "object")) {
                return
            }
            switch (element.type) {
                case "image":
                    elements.push(this.parseImage(element))
                    break
            }
        })
        return elements
    }

    private parseImage(data: any) {
        const imageURI = data.data?.uri
        if (!imageURI) {
            throw new Error("Image URI is not defined")
        }
        const image = new ImageElement()
        image.rect = this.parseRect(data?.rect)
        image.data = {
            image: imageURI,
            borderRadius: data.borderRadius * this.pr
        }
        return image
    }

    private parseRect(data: any) {
        if (typeof data !== "object") {
            throw new Error("Rect is not defined")
        }
        const rect = new Rect()
        rect.x = data.x * this.pr
        rect.y = data.y * this.pr
        rect.width = data.width * this.pr
        rect.height = data.height * this.pr
        rect.rotation = data.rotation * this.pr
        return rect
    }
}
