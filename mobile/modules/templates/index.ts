import RNFS from "react-native-fs"
import { Modules, syncTemplates, TemplatesSyncConfig } from "@meme-bros/client-lib"
import { setupTemplatesStorage } from "./setup"

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

const syncTemplatesWrapper: Modules.TemplatesModule["syncTemplates"] =
    async () => {
        await setupTemplatesStorage()
        await syncTemplates(config)
    }

const loadTemplates: Modules.TemplatesModule["loadTemplates"] =
    () => {}

const templatesModules: Modules.TemplatesModule = {
    syncTemplates: syncTemplatesWrapper,
    loadTemplates
}

export default templatesModules
