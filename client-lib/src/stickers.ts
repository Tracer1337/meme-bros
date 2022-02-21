import type { SyncConfig } from "./sync"

export async function syncStickers(config: SyncConfig) {
    const { api } = config
    const stickers = await api.stickers.all.get()
    console.log({ stickers })
}
