import { usePublicAPI } from "@meme-bros/api-sdk"
import { Modules } from "@meme-bros/client-lib"

export function useStickersModule(): Modules.StickersModule {
    const api = usePublicAPI()

    return {
        loadStickers: () => api.stickers.all.get(),
        getStickerURI: (filename) => api.storage.sticker.url(filename)
    }
}
