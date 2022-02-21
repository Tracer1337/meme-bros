import { Controller, Get } from "@nestjs/common"
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
}
