import { Controller, Get, Param, Post, UseGuards } from "@nestjs/common"
import { ThrottlerGuard } from "@nestjs/throttler"
import { StickersService } from "./stickers.service"

@Controller("stickers")
export class StickersController {
    constructor(
        private readonly stickersService: StickersService
    ) {}

    @Get()
    async getAll() {
        const stickers = await this.stickersService.findAll()
        return stickers.map((sticker) => sticker.filename)
    }

    @Post(":filename/register-use")
    @UseGuards(ThrottlerGuard)
    async registerUse(@Param("filename") filename: string) {
        await this.stickersService.registerUse(filename)
    }
}
