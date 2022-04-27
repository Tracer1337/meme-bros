import { Controller, Get, Param, Post, Query, UseGuards, Body, Put, Delete } from "@nestjs/common"
import { ThrottlerGuard } from "@nestjs/throttler"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"
import { Roles } from "../roles/roles.decorator"
import { Role } from "../roles/role.enum"
import { RolesGuard } from "src/roles/roles.guard"
import { TemplatesService } from "./templates.service"
import { TemplateEntity } from "./entities/template.entity"
import { CreateTemplateDTO } from "./dto/create-template.dto"
import { GetAllTemplatesDTO } from "./dto/get-all-templates.dto"
import { UpdateTemplateDTO } from "./dto/update-template.dto"

@Controller("templates")
@UseGuards(JwtAuthGuard, RolesGuard)
export class TemplatesController {
    constructor(
        private readonly templatesService: TemplatesService
    ) {}

    @Post()
    @Roles(Role.ADMIN)
    async create(@Body() createTemplateDTO: CreateTemplateDTO) {
        this.templatesService.validateCanvas(createTemplateDTO.canvas)
        const template = await this.templatesService.create(createTemplateDTO)
        return new TemplateEntity(template)
    }

    @Get()
    @Roles(Role.PUBLIC)
    async getAll(@Query() getAllTemplatesDTO: GetAllTemplatesDTO) {
        const templates = await this.templatesService.findAll(getAllTemplatesDTO)
        return templates.map((template) => new TemplateEntity(template))
    }

    @Get(":id")
    @Roles(Role.PUBLIC)
    async getOne(@Param("id") id: string) {
        const template = await this.templatesService.findById(id)
        return new TemplateEntity(template)
    }

    @Get(":id/canvas")
    @Roles(Role.PUBLIC)
    async getCanvas(@Param("id") id: string) {
        return await this.templatesService.findCanvasById(id)
    }

    @Get("list/state")
    @Roles(Role.PUBLIC)
    async getHash() {
        return await this.templatesService.getHash()
    }

    @Get("list/hash")
    @Roles(Role.PUBLIC)
    async getHashList() {
        return await this.templatesService.getHashList()
    }

    @Get("list/new")
    @Roles(Role.PUBLIC)
    async getNewList() {
        return await this.templatesService.getNewList()
    }

    @Get("list/top")
    @Roles(Role.PUBLIC)
    async getTopList() {
        return await this.templatesService.getTopList()
    }

    @Get("list/hot")
    @Roles(Role.PUBLIC)
    async getHotList() {
        return await this.templatesService.getHotList()
    }

    @Post(":id/register-use")
    @UseGuards(ThrottlerGuard)
    @Roles(Role.PUBLIC)
    async registerUse(@Param("id") id: string) {
        await this.templatesService.registerUse(id)
    }
    
    @Put(":id")
    @Roles(Role.ADMIN)
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
    @Roles(Role.ADMIN)
    async delete(@Param("id") id: string) {
        await this.templatesService.delete(id)
    }
}
