import { Modules } from "@meme-bros/client-lib"

export function usePermissionsModule(): Modules.PermissionsModule {
    return {        
        request: () => Promise.resolve(true)
    }
}
