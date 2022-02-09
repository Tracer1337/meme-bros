import RNFS from "react-native-fs"
import {
    Modules,
    syncTemplates,
    TemplatesSyncConfig
} from "@meme-bros/client-lib"
import { setupTemplatesStorage } from "../lib/setup"
import { writeFilePatched } from "../lib/fs"
import { Documents } from "../lib/documents"

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

const templatesModule: Modules.TemplatesModule = {
    syncTemplates: syncTemplatesWrapper,
    loadTemplates,
    getPreviewURI: Documents.getPreviewURI,
    getCanvas: Documents.readCanvas
}

export default templatesModule
