import { Exclude } from "class-transformer"
import { UploadDocument, Upload } from "./upload.schema"

export class UploadEntity implements Upload {
    id: string
    
    link: string

    @Exclude()
    deletehash: string

    constructor(document: UploadDocument) {
        const object = document.toObject()
        this.id = object._id.toString()
        delete object._id
        delete object.__v
        Object.assign(this, object)
    }
}
