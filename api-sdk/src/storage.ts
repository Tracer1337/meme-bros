import { AxiosInstance } from "axios"
import { Config } from "./types"

export class StorageResource {
    constructor(
        private readonly axios: AxiosInstance,
        private readonly config: Config
    ) {}

    public url(filename: string) {
        return `${this.config.host}storage/${filename}`
    }

    public async get(filename: string) {
        const res = await this.axios.get<File>(`storage/${filename}`)
        return res.data
    }
}
