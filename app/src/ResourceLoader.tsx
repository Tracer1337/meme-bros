import { useEffect, useState } from "react"
import { useNetInfo } from "@react-native-community/netinfo"
import { useListeners, useModule } from "@meme-bros/client-lib"
import { useAppContext } from "./lib/context"
import { EventEmitter } from "@meme-bros/shared"

const events = new EventEmitter<{
    "templates.load": undefined
}>()

function useTemplatesSync() {
    const appContext = useAppContext()
    
    const { syncTemplates } = useModule("templates")

    const netInfo = useNetInfo()

    const [hasSynced, setHasSynced] = useState(false)

    const run = async () => {
        if (!syncTemplates) {
            return
        }
        try {
            appContext.set({ templates: { isSyncing: true } })
            await syncTemplates()
            appContext.set({ templates: { isSyncing: false } })
        } catch (error) {
            console.error(error)
            appContext.set({ templates: { isSyncing: false, error: true } })
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
            appContext.set({ templates: { isLoading: false } })
        }
    }

    useListeners(events, [["templates.load", run]])

    useEffect(() => {
        run()
    }, [])
}

function ResourceLoader() {
    useTemplatesSync()
    useTemplatesLoader()
    return null
}

export default ResourceLoader
