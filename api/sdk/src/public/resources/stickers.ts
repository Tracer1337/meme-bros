import { AxiosInstance } from "axios"
import { Config, Sticker } from "../types"
import { Resource } from "../../lib/resource"
import { Getter } from "../../lib/getter"

export class StickersResource extends Resource<Config> {
    public all: Getter<Sticker[]>
    
    constructor(axios: AxiosInstance, config: Config) {
        super(axios, config)
        this.all = new Getter(axios, () => "stickers")
    }

    async registerUse(filename: string) {
        await this.axios.post(`stickers/${filename}/register-use`)
    }
}
