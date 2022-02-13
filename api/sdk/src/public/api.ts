import globalAxios from "axios"
import { Config } from "./types"
import { API } from "../lib/api"
import { TemplatesResource } from "./resources/templates"
import { StorageResource } from "./resources/storage"

export class PublicAPI extends API<Config> {    
    public templates: TemplatesResource
    public storage: StorageResource
    
    constructor(config: Config) {
        super(config)
        this.templates = new TemplatesResource(this.axios, this.config)
        this.storage = new StorageResource(this.axios, this.config)
    }
    
    protected init() {
        this.axios = globalAxios.create({
            baseURL: this.config.host
        })
        this.templates = new TemplatesResource(this.axios, this.config)
        this.storage = new StorageResource(this.axios, this.config)
    }
}
