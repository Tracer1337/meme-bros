import * as Core from "@meme-bros/core-types"

const assets: Record<string, Uint8Array> = {}
const activeDownloads: Record<string, Promise<void>> = {}

async function fetchAsset(path: string) {
    if (!(path in activeDownloads)) {
        activeDownloads[path] = new Promise(async (resolve) => {
            const res = await fetch(`/assets/${path}`)
            assets[path] = new Uint8Array(await res.arrayBuffer())
            delete activeDownloads[path]
            resolve()
        })
    }
    await activeDownloads[path]
}

export const coreModules: Core.Modules = {
    readAsset: async (path: string) => {
        if (!(path in assets)) {
            await fetchAsset(path)
        }
        return assets[path]
    }
}
