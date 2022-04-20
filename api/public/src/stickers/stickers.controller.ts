import { Controller, Get, Param, Post, UseGuards, Body, Query, Delete } from "@nestjs/common"
import { ThrottlerGuard } from "@nestjs/throttler"
import { StickersService } from "./stickers.service"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"
import { CreateStickerDTO } from "./dto/create-sticker.dto"
import { StickerEntity } from "./entities/sticker.entity"
import { GetAllStickersDTO } from "./dto/get-all-stickers.dto"

@Controller("stickers")
export class StickersController {
    constructor(
        private readonly stickersService: StickersService
    ) {}
    
    @Post()
    @UseGuards(JwtAuthGuard)
    async create(@Body() createStickerDTO: CreateStickerDTO) {
        const sticker = await this.stickersService.create(createStickerDTO)
        return new StickerEntity(sticker)
    }

    @Get()
    async getAll(@Query() getAllStickersDTO: GetAllStickersDTO) {
        const stickers = await this.stickersService.findAll(getAllStickersDTO)
        return stickers.map((sticker) => new StickerEntity(sticker))
    }

    @Post(":filename/register-use")
    @UseGuards(ThrottlerGuard)
    async registerUse(@Param("filename") filename: string) {
        await this.stickersService.registerUse(filename)
    }

    @Delete(":filename")
    @UseGuards(JwtAuthGuard)
    async delete(@Param("filename") filename: string) {
        await this.stickersService.delete(filename)
    }
}
