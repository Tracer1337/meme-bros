import { AxiosInstance } from "axios"
import { Editor } from "@meme-bros/shared"
import { Template, CreateTemplate, Config } from "../types"
import { Getter } from "../../lib/getter"
import { PaginatedGetter } from "../../lib/pagination"
import { Resource } from "../../lib/resource"

export class TemplatesResource extends Resource<Config> {
    public all: PaginatedGetter<Template[]>
    public one: Getter<Template, [string]>
    public canvas: Getter<Editor.Canvas, [string]>
    
    constructor(axios: AxiosInstance, config: Config) {
        super(axios, config)
        this.all = new PaginatedGetter(axios, () => "templates")
        this.one = new Getter(axios, (id) => `templates/${id}`)
        this.canvas = new Getter(axios, (id) => `templates/${id}/canvas`)
    }

    async create(payload: CreateTemplate) {
        const res = await this.axios.post("templates", payload)
        return res.data
    }

    async update(template: Template, payload: Partial<CreateTemplate>) {
        const res = await this.axios.put(`templates/${template.id}`, payload)
        return res.data
    }

    async delete(template: Template) {
        await this.axios.delete(`templates/${template.id}`)
    }
}
