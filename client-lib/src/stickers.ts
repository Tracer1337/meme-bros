import type { SyncConfig } from "./sync"
import { diffUnique, join, assertDirExists } from "./utils"

export const STICKERS_FILE = "stickers.json"
export const STICKERS_DIR = "stickers"

export type StickersFile = string[]

export async function syncStickers(config: SyncConfig) {
    const { path, fs, api, download } = config

    await assertDirExists(config, STICKERS_DIR)

    const stickers = await api.stickers.all.get()

    const stickersFile = JSON.parse(
        await fs.readFile(join(path, STICKERS_FILE))
    ) || []

    const stickersDiff = diffUnique(
        stickersFile,
        stickers.map((sticker) => sticker.filename)
    )

    await Promise.all([
        ...stickersDiff.added.map(async (filename) => {
            try {
                await download(
                    api.storage.sticker.url(filename),
                    join(path, STICKERS_DIR, filename)
                )
            } catch (error) {
                console.error("Could not add sticker", error)
            }
        }),
        ...stickersDiff.removed.map(async (filename) => {
            try {
                await fs.rm(join(path, STICKERS_DIR, filename))
            } catch (error) {
                console.error("Could not remove sticker", error)
            }
        })
    ])

    await fs.writeFile(
        join(path, STICKERS_FILE),
        JSON.stringify(stickers, null, 4)
    )
}
