import { AxiosInstance } from "axios"
import { Editor } from "@meme-bros/shared"
import { Config, Pagination } from "./types"

export type Template = {
    id: string,
    name: string,
    hash: string,
    uses?: number,
    previewFile: string
}

export type CreateTemplate = {
    name: string,
    canvas: any
}

export type GetAllTemplates = Pagination & {
    hashes?: string[]
}

export class TemplatesResource {
    constructor(
        private readonly axios: AxiosInstance,
        private readonly config: Config
    ) {}

    public async getAll(params?: GetAllTemplates) {
        const res = await this.axios.get<Template[]>("templates", { params })
        return res.data
    }

    public async getAllAsMap(params?: GetAllTemplates) {
        const res = await this.axios.get<Template[]>("templates", { params })
        return Object.fromEntries(
            res.data.map((template) => [template.id, template])
        )
    }

    public async getOne(id: string) {
        const res = await this.axios.get<Template>(`templates/${id}`)
        return res.data
    }

    public getCanvasURL(id: string) {
        return `${this.config.host}/templates/${id}/canvas`
    }

    public async getCanvas(id: string) {
        const res = await this.axios.get<Editor.Canvas>(`templates/${id}/canvas`)
        return res.data
    }

    public async getHash() {
        const res = await this.axios.get<string>("templates/list/state")
        return res.data
    }

    public async getHashList() {
        const res = await this.axios.get<string[]>("templates/list/hash")
        return res.data
    }

    public async getNewList() {
        const res = await this.axios.get<string[]>("templates/list/new")
        return res.data
    }

    public async getTopList() {
        const res = await this.axios.get<string[]>("templates/list/top")
        return res.data
    }

    public async getHotList() {
        const res = await this.axios.get<string[]>("templates/list/hot")
        return res.data
    }

    public async create(payload: CreateTemplate) {
        const res = await this.axios.post<Template>("templates", payload)
        return res.data
    }

    public async update(id: string, payload: Partial<CreateTemplate>) {
        const res = await this.axios.put<Template>(`templates/${id}`, payload)
        return res.data
    }

    public async registerUse(id: string) {
        const res = await this.axios.post(`templates/${id}/register-use`)
        return res.data
    }

    public async delete(id: string) {
        await this.axios.delete(`templates/${id}`)
    }
}
