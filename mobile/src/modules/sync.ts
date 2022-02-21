import RNFS from "react-native-fs"
import { Modules, syncResources } from "@meme-bros/client-lib"
import { setupTemplatesStorage } from "../lib/setup"
import { writeFilePatched } from "../lib/fs"
import { usePublicAPI } from "@meme-bros/api-sdk"

export function useSyncModule(): Modules.SyncModule {
    const api = usePublicAPI()
    
    const syncResourcesWrapper: Modules.SyncModule["syncResources"] = async () => {
        await setupTemplatesStorage()
        await syncResources({
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

    return {
        syncResources: syncResourcesWrapper
    }
}
