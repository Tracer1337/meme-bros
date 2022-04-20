import { StickerDocument, Sticker } from "@meme-bros/api-lib"

export class StickerEntity implements Sticker {
    filename: string

    uses: number

    constructor(document: StickerDocument) {
        const object = document.toObject()
        delete object._id
        delete object.__v
        Object.assign(this, object)
    }
}
