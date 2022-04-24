import { StickerDocument, Sticker } from "@meme-bros/api-lib"
import { Expose } from "class-transformer"
import { Role } from "../../roles/role.enum"

export class StickerEntity implements Sticker {
    filename: string

    @Expose({ groups: [Role.ADMIN] })
    uses: number

    constructor(document: StickerDocument) {
        const object = document.toObject()
        delete object._id
        delete object.__v
        Object.assign(this, object)
    }
}
