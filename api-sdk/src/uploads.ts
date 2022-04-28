import { AxiosInstance } from "axios"
import { Config, Pagination } from "./types"

export type Upload = {
    id: string,
    link: string
}

export class UploadsResource {
    constructor(private readonly axios: AxiosInstance, _config: Config) {}

    public async getAll(params: Pagination) {
        const res = await this.axios.get<Upload[]>("uploads", { params })
        return res.data
    }

    public async uploadImage(dataURI: string) {
        const res = await this.axios.post<string>("uploads", { uri: dataURI })
        return res.data
    }

    public async delete(upload: Upload) {
        await this.axios.delete(`uploads/${upload.id}`)
    }
}
