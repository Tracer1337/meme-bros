import { Modules } from "@meme-bros/client-lib"

const permissionsModule: Modules.PermissionsModule = {
    request: () => Promise.resolve(true)
}

export default permissionsModule
