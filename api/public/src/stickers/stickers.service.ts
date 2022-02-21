import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { Sticker, StickerDocument } from "@meme-bros/api-lib"

@Injectable()
export class StickersService {
    constructor(
        @InjectModel(Sticker.name) private readonly stickerModel: Model<StickerDocument>
    ) {}

    async findAll(): Promise<StickerDocument[]> {
        return await this.stickerModel
            .find()
            .sort({ uses: "descending" })
    }
}
