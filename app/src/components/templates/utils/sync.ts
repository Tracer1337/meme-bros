import { useEffect } from "react"
import { setupTemplatesStorage } from "./setup"

async function syncTemplates() {
}

export function useTemplatesSync() {
    useEffect(() => {
        setupTemplatesStorage()
            .then(syncTemplates)
    }, [])
}
