import { useEffect } from "react"
import { useAppContext } from "../../../lib/context"

export function useTemplatesSync() {
    const appContext = useAppContext()

    useEffect(() => {
        appContext.set({
            templates: {
                isSyncing: false
            }
        })
    }, [])
}
