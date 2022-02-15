import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common"
import { TemplatesService } from "./templates.service"
import { TemplateEntity } from "./entities/template.entity"
import { CreateTemplateDTO } from "./dto/create-template.dto"
import { GetAllTemplatesDTO } from "./dto/get-all-templates.dto"
import { UpdateTemplateDTO } from "./dto/update-template.dto"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"

@Controller("templates")
@UseGuards(JwtAuthGuard)
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
    async getAll(@Query() getAllTemplatesDTO: GetAllTemplatesDTO) {
        const templates = await this.templatesService.findAll(getAllTemplatesDTO)
        return templates.map((template) => new TemplateEntity(template))
    }

    @Get(":id")
    async getOne(@Param("id") id: string) {
        const template = await this.templatesService.findById(id)
        return new TemplateEntity(template)
    }

    @Get(":id/canvas")
    async getCanvas(@Param("id") id: string) {
        return await this.templatesService.findCanvasById(id)
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
