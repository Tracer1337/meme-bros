import { AxiosInstance } from "axios"
import { Config } from "../types"
import { Resource } from "../../lib/resource"

export class UploadResource extends Resource<Config> {
    constructor(axios: AxiosInstance, config: Config) {
        super(axios, config)
    }

    public async uploadImage(dataURI: string) {
        const res = await this.axios.post<string>("upload", { uri: dataURI })
        return res.data
    }
}
