import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common"
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
    async getAll() {
        const templates = await this.templatesService.findAll()
        return templates.map((template) => new TemplateEntity(template))
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

    @Delete(":id")
    async delete(@Param("id") id: string) {
        await this.templatesService.delete(id)
    }
}
