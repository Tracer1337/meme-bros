import RNFS from "react-native-fs"
import { Modules, syncTemplates } from "@meme-bros/client-lib"
import { setupTemplatesStorage } from "../lib/setup"
import { writeFilePatched } from "../lib/fs"
import { Documents } from "../lib/documents"
import { usePublicAPI } from "@meme-bros/api-sdk"

export function useTemplateModule(): Modules.TemplatesModule {
    const api = usePublicAPI()
    
    const syncTemplatesWrapper: Modules.TemplatesModule["syncTemplates"] = async () => {
        await setupTemplatesStorage()
        await syncTemplates({
            api,
            path: RNFS.DocumentDirectoryPath,
            fs: {
                ...RNFS,
                rm: RNFS.unlink,
                writeFile: writeFilePatched
            },
            download: async (fromUrl, toFile) => {
                await RNFS.downloadFile({ fromUrl, toFile }).promise
            }
        })
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
    
    return {
        syncTemplates: syncTemplatesWrapper,
        loadTemplates,
        getPreviewURI: Documents.getPreviewURI,
        getCanvas: Documents.readCanvas
    }
}
