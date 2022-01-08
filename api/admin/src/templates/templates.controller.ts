import { BadRequestException, Body, Controller, Get, Post } from "@nestjs/common"
import { TemplatesService } from "./templates.service"
import { TemplateEntity } from "./entities/template.entity"
import { CreateTemplateDTO } from "./dto/create-template.dto"
import { canvasValidator } from "./validators/canvas.validator"

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
        const { error } = canvasValidator
            .label("canvas")
            .required()
            .validate(createTemplateDTO.canvas)
        if (error) {
            const errors = error.details.map((error) => error.message)
            throw new BadRequestException(errors)
        }
        const template = await this.templatesService.create(createTemplateDTO)
        return new TemplateEntity(template)
    }
}
