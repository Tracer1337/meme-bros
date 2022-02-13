import { AxiosInstance } from "axios"
import { Editor } from "@meme-bros/shared"
import { Template, Config } from "../types"
import { Getter } from "../../lib/getter"
import { Resource } from "../../lib/resource"

export class TemplatesResource extends Resource<Config> {
    public all: Getter<Template[], [] | [{ hashes?: string[] }]>
    public map: Getter<Record<string, Template>, [] | [{ hashes?: string[] }]>
    public one: Getter<Template, [string]>
    public canvas: Getter<Editor.Canvas, [Template]>
    public hash: Getter<string>
    public hashList: Getter<string[]>
    public newList: Getter<string[]>
    public topList: Getter<string[]>
    public hotList: Getter<string[]>
    
    constructor(axios: AxiosInstance, config: Config) {
        super(axios, config)
    
        this.all = new Getter(axios, () => "templates")
        this.all.get = async (args?) => {
            const res = await axios.get<Template[]>("templates", {
                params: args
            })
            return res.data
        }
    
        this.map = new Getter(axios, () => "templates")
        this.map.get = async (args?) => {
            const res = await axios.get<Template[]>("templates", {
                params: args
            })
            return Object.fromEntries(
                res.data.map((template) => [template.id, template])
            )
        }
    
        this.one = new Getter(axios, (id) => `templates/${id}`)
        this.canvas = new Getter(axios, (template) => `templates/${template.id}/canvas`)
        this.hash = new Getter(axios, () => "templates/hash")
        this.hashList = new Getter(axios, () => "templates/list/hash")
        this.newList = new Getter(axios, () => "templates/list/new")
        this.topList = new Getter(axios, () => "templates/list/top")
        this.hotList = new Getter(axios, () => "templates/list/hot")
    }

    public async registerUse(template: Template) {
        await this.axios.post(`templates/${template.id}/register-use`)
    }
}
