import Resource from "../../lib/resource"
import { Template } from "../types"

export class StorageResource extends Resource {
    constructor(host: string) {
        super(`${host}/storage`)
    }

    public getTemplatePreviewURL(template: Template) {
        return this.url(template.previewFile)
    }
}
