import { AxiosInstance } from "axios"
import { Sticker } from "./stickers"
import { Template } from "./templates"
import { Config } from "./types"

export class StorageResource {
    constructor(private readonly axios: AxiosInstance, _config: Config) {}

    public async getTemplatePreview(template: Template) {
        const res = await this.axios.get<File>(`storage/${template.previewFile}`)
        return res.data
    }

    public async getSticker(sticker: Sticker) {
        const res = await this.axios.get<File>(`storage/${sticker.filename}`)
        return res.data
    }
}
