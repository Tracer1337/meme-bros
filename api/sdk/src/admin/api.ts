import globalAxios from "axios"
import { Config } from "./types"
import { API } from "../lib/api"
import { AuthResource } from "./resources/auth"
import { StorageResource } from "./resources/storage"
import { TemplatesResource } from "./resources/templates"
import { UploadsResource } from "./resources/uploads"

export class AdminAPI extends API<Config> {
    public auth: AuthResource
    public templates: TemplatesResource
    public storage: StorageResource
    public uploads: UploadsResource
    
    constructor(config: Config) {
        super(config)
        this.auth = new AuthResource(this.axios, this.config)
        this.templates = new TemplatesResource(this.axios, this.config)
        this.storage = new StorageResource(this.axios, this.config)
        this.uploads = new UploadsResource(this.axios, this.config)
    }

    protected init() {
        this.axios = globalAxios.create({
            baseURL: this.config.host
        })
        this.axios.interceptors.request.use((req) => {
            if (this.config.token && req.headers) {
                req.headers["Authorization"] = `Bearer ${this.config.token}`
            }
            return req
        })
        this.auth = new AuthResource(this.axios, this.config)
        this.templates = new TemplatesResource(this.axios, this.config)
        this.storage = new StorageResource(this.axios, this.config)
        this.uploads = new UploadsResource(this.axios, this.config)
    }
}
