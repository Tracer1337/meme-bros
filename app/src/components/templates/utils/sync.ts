import { useEffect } from "react"
import RNFS from "react-native-fs"
import { useNetInfo } from "@react-native-community/netinfo"
import { syncTemplates, TemplatesSyncConfig } from "@meme-bros/client-lib"
import { useAppContext } from "../../../lib/context"
import { setupTemplatesStorage } from "./setup"
import { writeFilePatched } from "./storage"

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

    useEffect(() => {
        if (!netInfo.isConnected) {
            return
        }
        setupTemplatesStorage()
            .then(() => {
                appContext.set({
                    templates: {
                        isSyncing: true,
                        error: false
                    }
                })
                return syncTemplates(config)
            })
            .then(() => appContext.set({
                templates: {
                    isSyncing: false,
                    error: false
                }
            }))
            .catch((error) => {
                console.error(error)
                appContext.set({
                    templates: {
                        isSyncing: false,
                        error: true
                    }
                })
            })
    }, [netInfo.isConnected])
}
