import { Controller, Get, Param, Post, UseGuards, Body, Query, Delete } from "@nestjs/common"
import { ThrottlerGuard } from "@nestjs/throttler"
import { StickersService } from "./stickers.service"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"
import { RolesGuard } from "../roles/roles.guard"
import { Roles } from "../roles/roles.decorator"
import { Role } from "../roles/role.enum"
import { CreateStickerDTO } from "./dto/create-sticker.dto"
import { StickerEntity } from "./sticker.entity"
import { GetAllStickersDTO } from "./dto/get-all-stickers.dto"

@Controller("stickers")
@UseGuards(JwtAuthGuard, RolesGuard)
export class StickersController {
    constructor(
        private readonly stickersService: StickersService
    ) {}
    
    @Post()
    @Roles(Role.ADMIN)
    async create(@Body() createStickerDTO: CreateStickerDTO) {
        const sticker = await this.stickersService.create(createStickerDTO)
        return new StickerEntity(sticker)
    }

    @Get()
    @Roles(Role.PUBLIC)
    async getAll(@Query() getAllStickersDTO: GetAllStickersDTO) {
        const stickers = await this.stickersService.findAll(getAllStickersDTO)
        return stickers.map((sticker) => new StickerEntity(sticker))
    }

    @Post(":filename/register-use")
    @UseGuards(ThrottlerGuard)
    @Roles(Role.PUBLIC)
    async registerUse(@Param("filename") filename: string) {
        await this.stickersService.registerUse(filename)
    }

    @Delete(":filename")
    @Roles(Role.ADMIN)
    async delete(@Param("filename") filename: string) {
        await this.stickersService.delete(filename)
    }
}
