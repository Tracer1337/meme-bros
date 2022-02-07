import { useEffect } from "react"
import { loadTemplateLists } from "./index"
import { useAppContext } from "../../../lib/context"

export function useTemplatesSync() {
    const appContext = useAppContext()

    const sync = async () => {
        appContext.set({
            templates: { isSyncing: false, isLoading: true }
        })
        const lists = await loadTemplateLists()
        appContext.set({
            templates: { isLoading: false, lists }
        })
    }

    useEffect(() => {
        sync()
    }, [])
}
