import { AxiosInstance } from "axios"
import { Config, Pagination } from "./types"

export type Sticker = {
    filename: string,
    uses?: number
}

export type CreateSticker = {
    uri: string
}

export class StickersResource {
    constructor(private readonly axios: AxiosInstance, _config: Config) {}

    public async getAll(params?: Pagination) {
        const res = await this.axios.get<Sticker[]>("stickers", { params })
        return res.data
    }

    public async create(payload: CreateSticker) {
        const res = await this.axios.post<Sticker>("stickers", payload)
        return res.data
    }

    public async registerUse(filename: string) {
        await this.axios.post(`stickers/${filename}/register-use`)
    }

    public async delete(filename: string) {
        await this.axios.delete(`stickers/${filename}`)
    }
}
