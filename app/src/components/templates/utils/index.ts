import { Editor } from "@meme-bros/shared"
import { useEffect, useState } from "react"
import { Dimensions, Platform } from "react-native"
import RNFS from "react-native-fs"
import { TemplateCanvas, TemplateMeta, TemplatesFile } from "../types"

const PREVIEWS_DIR = "previews"
const TEMPLATES_DIR = "templates"

const TEMPLATES_FILE = "templates.json"

export function getPreviewURI(template: TemplateMeta) {
    return `asset:/${PREVIEWS_DIR}/${template.previewFile}`
}

export async function loadTemplates() {
    if (Platform.OS === "android") {
        const json = await RNFS.readFileAssets(TEMPLATES_FILE)
        return JSON.parse(json) as TemplatesFile
    } else {
        throw new Error("Not implemented")
    }
}

export async function loadTemplate(template: TemplateMeta) {
    if (Platform.OS === "android") {
        const json = await RNFS.readFileAssets(
            `${TEMPLATES_DIR}/${template.templateFile}`
        )
        return JSON.parse(json) as TemplateCanvas
    } else {
        throw new Error("Not implemented")
    }
}

function scaleRect<
    T extends Record<K, Editor.Rect>,
    K extends keyof T
>(obj: T, key: K, width: number) {
    obj[key] = {
        ...obj[key],
        x: obj[key].x * width,
        y: obj[key].y * width,
        width: obj[key].width * width,
        height: obj[key].height * width
    }
}

export function scaleTemplateCanvas(canvas: TemplateCanvas) {
    const width = Dimensions.get("window").width * 0.9
    const imageWidth = 500

    canvas.width = width
    canvas.height = canvas.height * width

    canvas.pixelRatio = Math.max(imageWidth / width, 1)

    if (canvas.base?.rect) {
        scaleRect(
            canvas.base as Required<Editor.CanvasBase>,
            "rect",
            width
        )
    }

    canvas.layers.forEach((id) => {
        scaleRect(canvas.elements[id], "rect", width)
    })

    return canvas
}

export function useTemplates(): TemplateMeta[] {
    const [templatesFile, setTemplatesFile] = useState<
        TemplatesFile | undefined
    >()

    useEffect(() => {
        loadTemplates()
            .then(setTemplatesFile)
            .catch((error) => console.error(error))
    }, [])

    return !templatesFile
        ? []
        : templatesFile.list.map((id) => templatesFile.meta[id])
}
