import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { Sticker, StickerSchema } from "@meme-bros/api-lib"
import { StickersController } from "./stickers.controller"
import { StickersService } from "./stickers.service"

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: Sticker.name,
            schema: StickerSchema
        }])
    ],
    controllers: [StickersController],
    providers: [StickersService]
})
export class StickersModule {}
