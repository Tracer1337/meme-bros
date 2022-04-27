import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { StorageModule } from "../storage/storage.module"
import { Sticker, StickerSchema } from "../schemas/sticker.schema"
import { StickersController } from "./stickers.controller"
import { StickersService } from "./stickers.service"

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: Sticker.name,
            schema: StickerSchema
        }]),
        StorageModule
    ],
    controllers: [StickersController],
    providers: [StickersService]
})
export class StickersModule {}
