import { useEffect, useState } from "react"
import { Platform } from "react-native"
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
