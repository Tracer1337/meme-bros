import { Expose } from "class-transformer"
import { StickerDocument, Sticker } from "src/schemas/sticker.schema"
import { Role } from "src/roles/role.enum"

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
