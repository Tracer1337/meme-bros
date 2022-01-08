import { TemplateDocument } from "../schemas/template.schema"

export class TemplateEntity {
    name: string

    constructor(document: TemplateDocument) {
        const object = document.toObject()
        delete object._id
        delete object.__v
        Object.assign(this, object)
    }
}
