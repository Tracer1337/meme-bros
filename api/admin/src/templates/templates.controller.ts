import { Body, Controller, Get, Param, Post, Put, Query } from "@nestjs/common"
import { TemplatesService } from "./templates.service"
import { TemplateEntity } from "./entities/template.entity"
import { CreateTemplateDTO } from "./dto/create-template.dto"
import { UpdateTemplateDTO } from "./dto/update-template.dto"

@Controller("templates")
export class TemplatesController {
    constructor(
        private readonly templatesService: TemplatesService
    ) {}

    @Post()
    async create(@Body() createTemplateDTO: CreateTemplateDTO) {
        this.templatesService.validateCanvas(createTemplateDTO.canvas)
        const template = await this.templatesService.create(createTemplateDTO)
        return new TemplateEntity(template)
    }

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

    @Put(":id")
    async update(
        @Param("id") id: string,
        @Body() updateTemplateDTO: UpdateTemplateDTO
    ) {
        if (updateTemplateDTO.canvas) {
            this.templatesService.validateCanvas(updateTemplateDTO.canvas)
        }
        const template = await this.templatesService.update(
            id,
            updateTemplateDTO
        )
        return new TemplateEntity(template)
    }

    @Post(":id/register-use")
    async registerUse(@Param("id") id: string) {
        await this.templatesService.registerUse(id)
    }
}
