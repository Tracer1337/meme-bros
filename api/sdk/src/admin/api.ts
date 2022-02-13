import globalAxios from "axios"
import { Config } from "./types"
import { API } from "../lib/api"
import { AuthResource } from "./resources/auth"
import { StorageResource } from "./resources/storage"
import { TemplatesResource } from "./resources/templates"

export class AdminAPI extends API {
    public auth: AuthResource
    public templates: TemplatesResource
    public storage: StorageResource
    
    constructor(private config: Config) {
        super()
        this.auth = new AuthResource(this.axios, this.config)
        this.templates = new TemplatesResource(this.axios, this.config)
        this.storage = new StorageResource(this.axios, this.config)
        this.init()
    }

    private init() {
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
    }

    public setConfig(config: Config) {
        this.config = config
        this.init()
    }
}
