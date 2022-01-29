import { Platform } from "react-native"
import RNFS from "react-native-fs"
import { TemplateCanvas, TemplateMeta, TemplatesFile, API } from "@meme-bros/client-lib"
import { PREVIEWS_DIR, TEMPLATES_DIR, TEMPLATES_FILE } from "./constants"

export function join(...paths: string[]) {
    return paths.join("/")
}

// Workaround for https://github.com/itinance/react-native-fs/pull/837
async function writeFilePatched(path: string, content: string) {
    await RNFS.unlink(path)
    await RNFS.writeFile(path, content)
}

export namespace Assets {
    export const readFile = Platform.select({
        android: RNFS.readFileAssets,
        default: () => {
            throw new Error("Not implemented")
        }
    })    
    
    export async function readTemplatesFile() {
        const json = await readFile(TEMPLATES_FILE)
        return JSON.parse(json) as TemplatesFile
    }

    export async function readTemplate(template: TemplateMeta) {
        const json = await readFile(
            join(TEMPLATES_DIR, template.templateFile)
        )
        return JSON.parse(json) as TemplateCanvas
    }    
}

export namespace Documents {
    function path(relativePath: string) {
        return join(RNFS.DocumentDirectoryPath, relativePath)
    }

    export async function readTemplatesFile(): Promise<TemplatesFile> {
        const json = await RNFS.readFile(path(TEMPLATES_FILE))
        return JSON.parse(json)
    }

    export async function writeTemplatesFile(data: TemplatesFile) {
        const content = JSON.stringify(data)
        await writeFilePatched(path(TEMPLATES_FILE), content)
    }

    export async function readTemplate(hash: string) {
        const json = await RNFS.readFile(path(join(TEMPLATES_DIR, `${hash}.json`)))
        return JSON.parse(json) as TemplateCanvas
    }

    export async function writeTemplate(template: API.Template) {
        const filename = `${template.hash}.json`
        await RNFS.writeFile(
            path(join(TEMPLATES_DIR, filename)),
            JSON.stringify(template.canvas)
        )
        return filename
    }

    export async function removeTemplate(template: TemplateMeta) {
        await RNFS.unlink(path(join(TEMPLATES_DIR, template.templateFile)))
    }

    export async function downloadPreview(template: API.Template) {
        await RNFS.downloadFile({
            fromUrl: API.getPreviewURL(template),
            toFile: path(join(PREVIEWS_DIR, template.previewFile))
        }).promise
    }

    export async function removePreview(template: TemplateMeta) {
        await RNFS.unlink(path(join(PREVIEWS_DIR, template.previewFile)))
    }
}
