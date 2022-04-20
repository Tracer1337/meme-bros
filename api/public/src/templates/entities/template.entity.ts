import { Exclude, Expose } from "class-transformer"
import { TemplateDocument } from "@meme-bros/api-lib"

export class TemplateEntity {
    id: string

    hash: string

    @Exclude()
    uses: number
    
    name: string

    @Exclude()
    previewFile: string
    
    @Expose()
    canvas: object

    constructor(document: TemplateDocument) {
        const object = document.toObject()
        this.id = object._id.toString()
        delete object._id
        delete object.__v
        Object.assign(this, object)
    }
}
