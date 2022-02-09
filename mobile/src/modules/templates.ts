import RNFS from "react-native-fs"
import {
    CANVAS_DIR,
    Modules,
    PREVIEWS_DIR,
    syncTemplates,
    TemplatesSyncConfig
} from "@meme-bros/client-lib"
import * as API from "@meme-bros/api-sdk"
import { Editor } from "@meme-bros/shared"
import { setupTemplatesStorage } from "../lib/setup"

const config: TemplatesSyncConfig = {
    path: RNFS.DocumentDirectoryPath,
    fs: {
        ...RNFS,
        rm: RNFS.unlink,
        writeFile: writeFilePatched
    },
    download: async (fromUrl, toFile) => {
        await RNFS.downloadFile({ fromUrl, toFile }).promise
    }
}

const syncTemplatesWrapper: Modules.TemplatesModule["syncTemplates"] = async () => {
    await setupTemplatesStorage()
    await syncTemplates(config)
}

const loadTemplates: Modules.TemplatesModule["loadTemplates"] = async () => {
    const templatesFile = await Documents.readTemplatesFile()

    const pickTemplates = (ids: string[]) =>
        ids.map((id) => templatesFile.meta[id])

    return {
        new: pickTemplates(templatesFile.newList),
        top: pickTemplates(templatesFile.topList),
        hot: pickTemplates(templatesFile.hotList)
    }
}

const getPreviewURI = (template: API.Template) => "file://" + join(
    RNFS.DocumentDirectoryPath,
    PREVIEWS_DIR,
    template.previewFile
)

const getCanvas = async (template: API.Template) => {
    const json = await RNFS.readFile(join(
        RNFS.DocumentDirectoryPath,
        CANVAS_DIR,
        `${template.hash}.json`
    ))
    return JSON.parse(json) as Editor.Canvas
}

const templatesModules: Modules.TemplatesModule = {
    syncTemplates: syncTemplatesWrapper,
    loadTemplates,
    getPreviewURI,
    getCanvas
}

export default templatesModules
