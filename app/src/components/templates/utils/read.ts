import { Platform } from "react-native"
import RNFS from "react-native-fs"
import { TemplateCanvas, TemplateMeta, TemplatesFile } from "../types"
import { TEMPLATES_DIR, TEMPLATES_FILE } from "./constants"

export const readFromAssets = Platform.select({
    android: RNFS.readFileAssets,
    default: () => {
        throw new Error("Not implemented")
    }
})

export async function readTemplatesFileFromAssets() {
    const json = await readFromAssets(TEMPLATES_FILE)
    return JSON.parse(json) as TemplatesFile
}

export async function readTemplateFromAssets(template: TemplateMeta) {
    const json = await readFromAssets(
        `${TEMPLATES_DIR}/${template.templateFile}`
    )
    return JSON.parse(json) as TemplateCanvas
}
