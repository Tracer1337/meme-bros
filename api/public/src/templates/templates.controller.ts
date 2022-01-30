import { Controller, Get, Param, Post, Query } from "@nestjs/common"
import { TemplatesService } from "./templates.service"
import { TemplateEntity } from "./entities/template.entity"

@Controller("templates")
export class TemplatesController {
    constructor(
        private readonly templatesService: TemplatesService
    ) {}

    @Get()
    async getAll(@Query("hashes") hashes: string[]) {
        const templates = await this.templatesService.findAll({
            hashes
        })
        return templates.map((template) => new TemplateEntity(template))
    }

    @Get(":id/canvas")
    async getCanvas(@Param("id") id: string) {
        return await this.templatesService.findCanvasById(id)
    }

    @Get("hash")
    async getList() {
        return await this.templatesService.getHash()
    }

    @Get("list/hash")
    async getHashList() {
        return await this.templatesService.getHashList()
    }

    @Get("list/new")
    async getNewList() {
        return await this.templatesService.getNewList()
    }

    @Get("list/top")
    async getTopList() {
        return await this.templatesService.getTopList()
    }

    @Get("list/hot")
    async getHotList() {
        return await this.templatesService.getHotList()
    }

    @Post(":id/register-use")
    async registerUse(@Param("id") id: string) {
        await this.templatesService.registerUse(id)
    }
}
