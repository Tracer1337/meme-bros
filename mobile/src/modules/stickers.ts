import { Modules } from "@meme-bros/client-lib"
import { Resources } from "../lib/resources"

export function useStickersModule(): Modules.StickersModule {
    return {
        loadStickers: async () => {
            const files = await Resources.readStickersFile()
            return files.map((filename) => ({ filename }))
        },
        getStickerURI: Resources.getStickerURI
    }
}
