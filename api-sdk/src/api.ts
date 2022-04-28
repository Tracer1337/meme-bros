import axios, { AxiosInstance } from "axios"
import { Config } from "./types"
import { AuthResource } from "./auth"
import { TemplatesResource } from "./templates"
import { StickersResource } from "./stickers"
import { StorageResource } from "./storage"
import { UploadsResource } from "./uploads"

export class API {
    private readonly axios: AxiosInstance
    public auth: AuthResource
    public templates: TemplatesResource
    public stickers: StickersResource
    public storage: StorageResource
    public uploads: UploadsResource

    constructor(config: Config) {
        this.axios = axios.create({
            baseURL: config.host
        })

        this.axios.interceptors.request.use((req) => {
            if (config.token && req.headers) {
                req.headers["Authorization"] = `Bearer ${config.token}`
            }
            return req
        })

        this.auth = new AuthResource(this.axios, config)
        this.templates = new TemplatesResource(this.axios, config)
        this.stickers = new StickersResource(this.axios, config)
        this.storage = new StorageResource(this.axios, config)
        this.uploads = new UploadsResource(this.axios, config)
    }
}
