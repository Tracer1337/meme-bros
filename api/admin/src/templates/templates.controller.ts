import { Body, Controller, Get, Post } from "@nestjs/common"
import { TemplatesService } from "./templates.service"
import { TemplateEntity } from "./entities/template.entity"
import { CreateTemplateDTO } from "./dto/create-template.dto"

@Controller("templates")
export class TemplatesController {
    constructor(
        private readonly templatesService: TemplatesService
    ) {}

    @Get()
    async getAll() {
        const templates = await this.templatesService.findAll()
        return templates.map((template) => new TemplateEntity(template))
    }

    @Post()
    async create(@Body() createTemplateDTO: CreateTemplateDTO) {
        const template = await this.templatesService.create(createTemplateDTO)
        return new TemplateEntity(template)
    }
}
