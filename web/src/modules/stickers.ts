import { useAPI } from "@meme-bros/api-sdk"
import { Modules } from "@meme-bros/client-lib"

export function useStickersModule(): Modules.StickersModule {
    const api = useAPI()

    return {
        loadStickers: () => api.stickers.getAll(),
        getStickerURI: (filename) => api.storage.url(filename)
    }
}
