import { AxiosInstance } from "axios"
import { Config, Upload } from "../types"
import { Resource } from "../../lib/resource"
import { PaginatedGetter } from "../../lib/pagination"

export class UploadsResource extends Resource<Config> {
    public all: PaginatedGetter<Upload[]>
    
    constructor(axios: AxiosInstance, config: Config) {
        super(axios, config)
        this.all = new PaginatedGetter(axios, () => "uploads")
    }
}
