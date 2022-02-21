import { Modules } from "@meme-bros/client-lib"
import { Resources } from "../lib/resources"

const stickersModule: Modules.StickersModule = {
    loadStickers: Resources.readStickersFile,
    getStickerURI: Resources.getStickerURI
}

export default stickersModule
