import * as RNFS from "react-native-fs"
import {
    CANVAS_DIR,
    join,
    PREVIEWS_DIR,
    RESOURCES_DIR,
    TemplatesFile,
    TEMPLATES_FILE
} from "@meme-bros/client-lib"
import * as API from "@meme-bros/api-sdk"
import { Editor } from "@meme-bros/shared"

export namespace Documents {
    function path(relativePath: string) {
        return join(RNFS.DocumentDirectoryPath, RESOURCES_DIR, relativePath)
    }

    export async function readTemplatesFile(): Promise<TemplatesFile> {
        const json = await RNFS.readFile(path(TEMPLATES_FILE))
        return JSON.parse(json)
    }

    export async function readCanvas(template: API.Template) {
        const json = await RNFS.readFile(
            path(join(CANVAS_DIR, `${template.hash}.json`))
        )
        return JSON.parse(json) as Editor.Canvas
    }

    export function getPreviewURI(template: API.Template) {
        return "file://" + path(join(PREVIEWS_DIR, template.previewFile))
    }
}
