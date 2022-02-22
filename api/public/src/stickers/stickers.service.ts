import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { FilterQuery, Model } from "mongoose"
import { Sticker, StickerDocument } from "@meme-bros/api-lib"

@Injectable()
export class StickersService {
    constructor(
        @InjectModel(Sticker.name) private readonly stickerModel: Model<StickerDocument>
    ) {}

    async findAll(): Promise<StickerDocument[]> {
        return await this.stickerModel.find()
            .sort({ uses: "descending" })
    }

    async registerUse(filename: string) {
        await this.assertStickerExists({ filename })
        await this.stickerModel.updateOne({ filename }, {
            $inc: {
                uses: 1
            }
        })
    }

    async assertStickerExists(query: FilterQuery<StickerDocument>) {
        const exists = await this.stickerModel.exists(query)
        if (!exists) {
            throw new NotFoundException()
        }
    }
}
