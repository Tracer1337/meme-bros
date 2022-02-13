import { AxiosInstance } from "axios"
import { Template, Config } from "../types"
import { Getter } from "../../lib/getter"
import { Resource } from "../../lib/resource"

export class StorageResource extends Resource<Config> {
    public templatePreview: Getter<File, [Template]>

    constructor(axios: AxiosInstance, config: Config) {
        super(axios, config)
        this.templatePreview = new Getter(
            axios,
            (template) => `storage/${template.previewFile}`
        )
    }
}
