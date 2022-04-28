import { Expose } from "class-transformer"
import { Role } from "../roles/role.enum"
import { StickerDocument, Sticker } from "./sticker.schema"

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
