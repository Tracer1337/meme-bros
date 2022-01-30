import { Exclude } from "class-transformer"
import { Template, TemplateDocument } from "@meme-bros/api-lib"

export class TemplateEntity implements Template {
    id: string

    hash: string

    uses: number

    name: string

    previewFile: string

    @Exclude()
    canvas: any

    constructor(document: TemplateDocument) {
        const object = document.toObject()
        this.id = object._id.toString()
        delete object._id
        delete object.__v
        Object.assign(this, object)
    }
}
