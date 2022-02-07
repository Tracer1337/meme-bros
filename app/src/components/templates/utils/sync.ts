import { useEffect } from "react"
import RNFS from "react-native-fs"
import { useNetInfo } from "@react-native-community/netinfo"
import { syncTemplates, TemplatesSyncConfig } from "@meme-bros/client-lib"
import { useAppContext } from "../../../lib/context"
import { writeFilePatched } from "../../../lib/storage"
import { setupTemplatesStorage } from "./setup"
import { loadTemplateLists } from "./index"

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

export function useTemplatesSync() {
    const appContext = useAppContext()

    const netInfo = useNetInfo()

    const loadLists = async () => {
        appContext.set({
            templates: { isLoading: true }
        })
        const lists = await loadTemplateLists()
        appContext.set({
            templates: { isLoading: false, lists }
        })
    }

    const sync = async () => {
        try {
            appContext.set({
                templates: { isSyncing: true, error: false }
            })
            await setupTemplatesStorage()
            await loadLists()
            await syncTemplates(config)
            appContext.set({
                templates: {
                    isSyncing: false,
                    error: false,
                    lists: await loadTemplateLists()
                }
            })
        } catch (error) {
            console.error(error)
            appContext.set({
                templates: { isSyncing: false, error: true }
            })
        }
    }

    useEffect(() => {
        if (netInfo.isConnected) {
            sync()
        }
    }, [netInfo.isConnected])
}
