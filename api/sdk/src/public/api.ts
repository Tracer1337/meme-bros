import { StorageResource } from "./resources/storage"
import { TemplatesResource } from "./resources/templates"

export class API {
    public readonly templates: TemplatesResource
    public readonly storage: StorageResource

    constructor(host: string) {
        this.templates = new TemplatesResource(host)
        this.storage = new StorageResource(host)
    }
}
