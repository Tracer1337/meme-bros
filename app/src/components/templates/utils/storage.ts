import { Platform } from "react-native"
import RNFS from "react-native-fs"
import { Editor } from "@meme-bros/shared"
import { TemplateMeta, TemplatesFile } from "@meme-bros/client-lib"
import * as API from "@meme-bros/api-sdk"
import { PREVIEWS_DIR, CANVAS_DIR, TEMPLATES_FILE } from "./constants"

const { api } = API

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

    export async function readCanvas(template: TemplateMeta) {
        const json = await readFile(
            join(CANVAS_DIR, template.canvasFile)
        )
        return JSON.parse(json) as Editor.Canvas
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

    export async function readCanvas(template: API.Template) {
        const json = await RNFS.readFile(path(join(CANVAS_DIR, `${template.hash}.json`)))
        return JSON.parse(json) as Editor.Canvas
    }

    export async function downloadCanvas(template: API.Template) {
        const filename = `${template.hash}.json`
        await RNFS.downloadFile({
            fromUrl: api.templates.canvas.url(template),
            toFile: path(join(CANVAS_DIR, filename))
        }).promise
        return filename
    }

    export async function removeCanvas(template: TemplateMeta) {
        await RNFS.unlink(path(join(CANVAS_DIR, template.canvasFile)))
    }

    export async function downloadPreview(template: API.Template) {
        await RNFS.downloadFile({
            fromUrl: api.storage.templatePreview.url(template),
            toFile: path(join(PREVIEWS_DIR, template.previewFile))
        }).promise
    }

    export async function removePreview(template: TemplateMeta) {
        await RNFS.unlink(path(join(PREVIEWS_DIR, template.previewFile)))
    }
}
