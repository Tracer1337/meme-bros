import { Exclude, Expose } from "class-transformer"
import { Role } from "../roles/role.enum"
import { Template, TemplateDocument } from "./template.schema"

export class TemplateEntity implements Template {
    id: string

    hash: string

    @Expose({ groups: [Role.ADMIN] })
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
