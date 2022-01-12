import { Editor } from "@meme-bros/shared"
import { useEffect, useState } from "react"
import RNFS from "react-native-fs"
import { TemplateCanvas, TemplateMeta, TemplatesFile } from "../types"
import { Dimensions } from "../../../lib/dimensions"
import { PREVIEWS_DIR } from "./constants"
import { Documents, join } from "./storage"

export function getPreviewURI(template: TemplateMeta) {
    return "file://" + join(
        RNFS.DocumentDirectoryPath,
        PREVIEWS_DIR,
        template.previewFile
    )
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
        Documents.readTemplatesFile()
            .then(setTemplatesFile)
            .catch((error) => console.error(error))
    }, [])

    return !templatesFile
        ? []
        : templatesFile.list.map((id) => templatesFile.meta[id])
}
