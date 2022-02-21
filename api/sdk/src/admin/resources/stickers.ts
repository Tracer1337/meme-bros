import { AxiosInstance } from "axios"
import { Sticker, CreateSticker, Config } from "../types"
import { PaginatedGetter } from "../../lib/pagination"
import { Resource } from "../../lib/resource"

export class StickersResource extends Resource<Config> {
    public all: PaginatedGetter<Sticker[]>
    
    constructor(axios: AxiosInstance, config: Config) {
        super(axios, config)
        this.all = new PaginatedGetter(axios, () => "stickers")
    }

    async create(payload: CreateSticker) {
        const res = await this.axios.post("stickers", payload)
        return res.data
    }

    async delete(sticker: Sticker) {
        await this.axios.delete(`stickers/${sticker.filename}`)
    }
}
