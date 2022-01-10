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

    @Get("list")
    async getList() {
        return await this.templatesService.getHashList()
    }

    @Get("list/hash")
    async getListHash() {
        return await this.templatesService.getHashListHash()
    }

    @Post(":id/register-use")
    async registerUse(@Param("id") id: string) {
        await this.templatesService.registerUse(id)
    }
}
