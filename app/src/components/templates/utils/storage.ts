import RNFS from "react-native-fs"
import { Editor } from "@meme-bros/shared"
import { TemplatesFile } from "@meme-bros/client-lib"
import * as API from "@meme-bros/api-sdk"
import { join } from "../../../lib/storage"
import { CANVAS_DIR, TEMPLATES_FILE } from "./constants"

export namespace Documents {
    function path(relativePath: string) {
        return join(RNFS.DocumentDirectoryPath, relativePath)
    }

    export async function readTemplatesFile(): Promise<TemplatesFile> {
        const json = await RNFS.readFile(path(TEMPLATES_FILE))
        return JSON.parse(json)
    }

    export async function readCanvas(template: API.Template) {
        const json = await RNFS.readFile(path(join(CANVAS_DIR, `${template.hash}.json`)))
        return JSON.parse(json) as Editor.Canvas
    }
}
