import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from "@nestjs/common"
import { StickersService } from "./stickers.service"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"
import { CreateStickerDTO } from "./dto/create-sticker.dto"
import { StickerEntity } from "./entities/sticker.entity"
import { GetAllStickersDTO } from "./dto/get-all-stickers.dto"

@Controller("stickers")
@UseGuards(JwtAuthGuard)
export class StickersController {
    constructor(
        private readonly stickersService: StickersService
    ) {}
    
    @Post()
    async create(@Body() createStickerDTO: CreateStickerDTO) {
        const sticker = await this.stickersService.create(createStickerDTO)
        return new StickerEntity(sticker)
    }

    @Get()
    async getAll(@Query() getAllStickersDTO: GetAllStickersDTO) {
        const stickers = await this.stickersService.findAll(getAllStickersDTO)
        return stickers.map((sticker) => new StickerEntity(sticker))
    }

    @Delete(":filename")
    async delete(@Param("filename") filename: string) {
        await this.stickersService.delete(filename)
    }
}
