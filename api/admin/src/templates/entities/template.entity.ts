import { TemplateDocument } from "../schemas/template.schema"

export class TemplateEntity {
    id: string

    name: string

    canvas: object

    constructor(document: TemplateDocument) {
        const object = document.toObject()
        this.id = object._id.toString()
        delete object._id
        delete object.__v
        Object.assign(this, object)
    }
}
