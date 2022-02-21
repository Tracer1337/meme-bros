import { AxiosInstance } from "axios"
import { Config } from "../types"
import { Resource } from "../../lib/resource"
import { Getter } from "../../lib/getter"

export class StickersResource extends Resource<Config> {
    public all: Getter<string>
    
    constructor(axios: AxiosInstance, config: Config) {
        super(axios, config)
        this.all = new Getter(axios, () => "stickers")
    }
}
