import { Platform } from "react-native"
import RNFS from "react-native-fs"
import { Modules, syncResources, RESOURCES_DIR, join } from "@meme-bros/client-lib"
import { useAPI } from "@meme-bros/api-sdk"
import { copyFolderAssets, writeFilePatched } from "../lib/fs"

export function useSyncModule(): Modules.SyncModule {
    const api = useAPI()

    const setupStorage = async () => {
        const path = join(RNFS.DocumentDirectoryPath, RESOURCES_DIR)
        if (await RNFS.exists(path)) {
            return
        }
        await copyFolderAssets(RESOURCES_DIR, path)
    }
    
    const syncResourcesWrapper: Modules.SyncModule["syncResources"] = async () => {
        if (Platform.OS !== "android") {
            throw new Error("Not implemented")
        }
        await setupStorage()
        await syncResources({
            api,
            path: join(RNFS.DocumentDirectoryPath, RESOURCES_DIR),
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
