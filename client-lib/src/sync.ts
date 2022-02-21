import * as API from "@meme-bros/api-sdk"
import { syncTemplates } from "./templates"
import { syncStickers } from "./stickers"

export type SyncConfig = {
    api: API.PublicAPI,
    path: string,
    fs: {
        rm: (path: string) => Promise<void>,
        mkdir: (path: string) => Promise<void>,
        readFile: (path: string) => Promise<string>,
        writeFile: (path: string, data: string) => Promise<void>,
        exists: (path: string) => Promise<boolean>
    },
    download: (url: string, to: string) => Promise<void>,
    clean?: boolean
}

export async function syncResources(config: SyncConfig) {
    await Promise.all([
        syncTemplates(config),
        syncStickers(config)
    ])
}
