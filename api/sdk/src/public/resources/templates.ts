import Resource from "../../lib/resource"
import { Template } from "../types"

export class TemplatesResource extends Resource {
    constructor(host: string) {
        super(`${host}/templates`)
    }

    public async getAll(hashes?: string[]) {
        const res = await this.axios.get<Template[]>("/", {
            params: { hashes }
        })
        return res.data
    }

    public async getAllAsMap(hashes?: string[]) {
        const list = await this.getAll(hashes)
        return Object.fromEntries(
            list.map((template) => [template.id, template])
        )
    }

    public getCanvasURL(template: Template) {
        return this.url(`${template.id}/canvas`)
    }

    public async getCanvas(id: string) {
        const res = await this.axios.get(`${id}/canvas`)
        return res.data
    }

    public async getHash() {
        const res = await this.axios.get<string>("hash")
        return res.data
    }

    public async getHashList() {
        const res = await this.axios.get<string[]>("list/hash")
        return res.data
    }
    
    public async getNewList() {
        const res = await this.axios.get<string[]>("list/new")
        return res.data
    }

    public async getTopList() {
        const res = await this.axios.get<string[]>("list/top")
        return res.data
    }

    public async getHotList() {
        const res = await this.axios.get<string[]>("list/hot")
        return res.data
    }

    public async registerUse(template: Template) {
        await this.axios.post<string>(`${template.id}/register-use`)
    }
}
