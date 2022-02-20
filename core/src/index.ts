import path from "path"
import Joi from "joi"
import { AnyFunction } from "tsdef"
import { createCanvas, CanvasRenderingContext2D, loadImage, registerFont } from "canvas"
import fontkit from "fontkit"
import * as Core from "@meme-bros/core-types"
import { getMimeTypeFromDataURI } from "@meme-bros/shared"
import { canvasValidator } from "./validation"
import { normalizeCanvas } from "./normalize"
import { drawRoundedRect } from "./lib/draw"
import { fittext } from "./lib/text"

const FONT_FAMILIES = ["Arial", "Comic-Sans", "Impact"]
const FONT_WEIGHTS = ["normal", "bold"]
const FONT_MAPPING: Record<string, string> = {}

const ASSETS_DIR = path.resolve(__dirname, "..", "assets")

type RenderingContext = {
    canvas: Core.Canvas,
    dc: CanvasRenderingContext2D
}

export async function render(canvas: Core.Canvas) {
    Joi.assert(canvas, canvasValidator, { allowUnknown: true })

    normalizeCanvas(canvas)

    await loadFonts()

    const context: RenderingContext = {
        canvas,
        dc: createCanvas(canvas.width, canvas.height).getContext("2d")
    }

    const restore = async (fn: AnyFunction) => {
        context.dc.save()
        await fn()
        context.dc.restore()
    }

    await restore(() => drawBackground(context))

    for (let element of canvas.elements) {
        await restore(async () => {
            applyRotation(context, element.rect)
            await drawElement(context, element)
            if (canvas.debug) {
                drawRect(context, element.rect)
            }
        })
    }

    return context.dc.canvas.toDataURL()
}

async function loadFonts() {
    const promises: Promise<void>[] = []
    FONT_FAMILIES.forEach((family) =>
        FONT_WEIGHTS.forEach((weight) => {
            promises.push(new Promise((resolve) => {
                const file = path.resolve(ASSETS_DIR, "fonts", `${family}_${weight}.ttf`)
                fontkit.open(file, "", (error, font) => {
                    if (error) throw error
                    FONT_MAPPING[family] = font.familyName
                    registerFont(file, { family, weight })
                    resolve()
                })
            }))
        })
    )
    await Promise.all(promises)
}

function resolveFontFamily(fontFamily: string) {
    return FONT_MAPPING[fontFamily] || fontFamily
}

function applyRotation({ dc }: RenderingContext, rect: Core.Rect) {
    const [cx, cy] = getCenter(rect)
    dc.translate(cx, cy)
    dc.rotate(rect.rotation)
    dc.translate(-cx, -cy)
}

function getCenter(rect: Core.Rect): [number, number] {
    return [rect.x + rect.width / 2, rect.y + rect.height / 2]
}

function drawElement(context: RenderingContext, element: Core.CanvasElement) {
    switch (element.type) {
        case "image":
            return drawImage(context, element)
        case "textbox":
            return drawTextbox(context, element)
        case "shape":
            return drawShape(context, element)
    }
}

function drawBackground({ canvas, dc }: RenderingContext) {
    dc.fillStyle = canvas.backgroundColor
    dc.beginPath()
    dc.fillRect(0, 0, canvas.width, canvas.height)
    dc.fill()
}

function drawRect({ dc }: RenderingContext, rect: Core.Rect) {
    dc.strokeStyle = "#00ff00"
    dc.lineWidth = 2
    dc.beginPath()
    dc.strokeRect(rect.x, rect.y, rect.width, rect.height)
}

async function drawImage(
    { dc }: RenderingContext,
    element: Core.PickElement<"image">
) {
    if (getMimeTypeFromDataURI(element.data.uri) === "image/gif") {
        console.log("Skip gif")
        return
    }
    
    const { x, y, width, height } = element.rect

    dc.beginPath()
    drawRoundedRect(dc, x, y, width, height, element.data.borderRadius)
    dc.clip()

    const image = await loadImage(element.data.uri)
    dc.drawImage(image, x, y, width, height)
}

async function drawTextbox(
    { dc }: RenderingContext,
    element: Core.PickElement<"textbox">
) {
    const { x, y, width, height } = element.rect
    const {
        color,
        fontFamily,
        fontWeight,
        backgroundColor,
        outlineColor,
        outlineWidth
    } = element.data
    const font = `"${resolveFontFamily(fontFamily)}" ${fontWeight}`
    const { text, fontSize } = fittext({
        text: getTransformedText(element),
        font,
        width,
        height
    })

    dc.fillStyle = backgroundColor

    dc.beginPath()
    dc.fillRect(x, y, width, height)
    
    dc.fillStyle = outlineColor
    dc.font = `${fontSize}px ${font}`
    dc.textAlign = "left"
    dc.textBaseline = "top"

    for (let dy = -outlineWidth; dy <= outlineWidth; dy++) {
        for (let dx = -outlineWidth; dx <= outlineWidth; dx++) {
            if (dx === 0 && dy === 0) continue
            dc.fillText(text, x + dx, y + dy)
        }
    }

    dc.fillStyle = color

    dc.fillText(text, x, y)
}

function getTransformedText(element: Core.PickElement<"textbox">) {
    let text = element.data.text
    if (element.data.caps) {
        text = text.toUpperCase()
    }
    return text
}

function drawShape(
    { dc }: RenderingContext,
    element: Core.PickElement<"shape">
) {
    const { x, y, width, height } = element.rect
    const [cx, cy] = getCenter(element.rect)
    const {
        variant,
        backgroundColor,
        borderColor,
        borderWidth
    } = element.data
    const bw = borderWidth

    dc.fillStyle = backgroundColor
    dc.strokeStyle = borderColor
    dc.lineWidth = borderWidth

    switch (variant) {
        case "rect":
            dc.beginPath()
            dc.fillRect(x, y, width, height)
            dc.strokeRect(x + bw / 2, y + bw / 2, width - bw, height - bw)
            break

        case "ellipse":
            dc.beginPath()
            dc.ellipse(cx, cy, width / 2, height / 2, 0, 0, Math.PI * 2)
            dc.fill()
            dc.beginPath()
            dc.ellipse(cx, cy, width / 2 - bw / 2, height / 2 - bw / 2, 0, 0, Math.PI * 2)
            dc.stroke()
            break

        default:
            throw new Error(`Unkown shape variant: '${variant}'`)
    }
}
