import { AxiosInstance } from "axios"
import { Config } from "../types"
import { Resource } from "../../lib/resource"

export class UploadsResource extends Resource<Config> {
    constructor(axios: AxiosInstance, config: Config) {
        super(axios, config)
    }

    public async uploadImage(dataURI: string) {
        const res = await this.axios.post<string>("uploads", { uri: dataURI })
        return res.data
    }
}
