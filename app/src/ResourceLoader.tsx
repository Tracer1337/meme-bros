import { useEffect, useState } from "react"
import { useNetInfo } from "@react-native-community/netinfo"
import { useListeners, useModule } from "@meme-bros/client-lib"
import { EventEmitter } from "@meme-bros/shared"
import { useAppContext } from "./lib/context"

const events = new EventEmitter<{
    "templates.load": undefined
}>()

function useResourceSync() {
    const appContext = useAppContext()
    
    const { syncResources } = useModule("sync")

    const netInfo = useNetInfo()

    const [hasSynced, setHasSynced] = useState(false)

    const run = async () => {
        if (!syncResources) {
            return
        }
        try {
            appContext.set({ sync: { isLoading: true } })
            await syncResources()
            appContext.set({ sync: { isLoading: false } })
        } catch (error) {
            console.error(error)
            appContext.set({ sync: { isLoading: false, error: true } })
        } finally {
            setHasSynced(true)
            events.emit("templates.load")
        }
    }

    useEffect(() => {
        if (netInfo.isConnected && !hasSynced) {
            run()
        }
    }, [netInfo.isConnected])
}

function useTemplatesLoader() {
    const appContext = useAppContext()

    const { loadTemplates } = useModule("templates")

    const run = async () => {
        try {
            appContext.set({ templates: { isLoading: true } })
            const lists = await loadTemplates()
            appContext.set({ templates: { isLoading: false, lists } })
        } catch (error) {
            console.error(error)
            appContext.set({ templates: { isLoading: false, error: true } })
        }
    }

    useListeners(events, [["templates.load", run]])

    useEffect(() => {
        run()
    }, [])
}

function ResourceLoader() {
    useResourceSync()
    useTemplatesLoader()
    return null
}

export default ResourceLoader
