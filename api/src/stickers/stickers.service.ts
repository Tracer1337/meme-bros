import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { FilterQuery, Model } from "mongoose"
import { getBase64FromDataURI, getFileExtensionFromDataURI } from "@meme-bros/shared"
import { Sticker, StickerDocument } from "../schemas/sticker.schema"
import { CreateStickerDTO } from "./dto/create-sticker.dto"
import { GetAllStickersDTO } from "./dto/get-all-stickers.dto"
import { StorageService } from "../storage/storage.service"

@Injectable()
export class StickersService {
    constructor(
        @InjectModel(Sticker.name) private readonly stickerModel: Model<StickerDocument>,
        private readonly storageService: StorageService
    ) {}

    async create(createStickerDTO: CreateStickerDTO): Promise<StickerDocument> {
        const buffer = Buffer.from(
            getBase64FromDataURI(createStickerDTO.uri),
            "base64"
        )
        const ext = getFileExtensionFromDataURI(createStickerDTO.uri)
        const filename = await this.storageService.put(buffer, ext)
        return await this.stickerModel.create({ filename })
    }

    async findAll(getAllUploadsDTO: GetAllStickersDTO): Promise<StickerDocument[]> {
        return this.stickerModel.find()
            .sort({ uses: "descending" })
            .limit(getAllUploadsDTO.per_page)
            .skip(getAllUploadsDTO.page * getAllUploadsDTO.per_page)
    }

    async registerUse(filename: string) {
        await this.assertStickerExists({ filename })
        await this.stickerModel.updateOne({ filename }, {
            $inc: {
                uses: 1
            }
        })
    }

    async delete(filename: string) {
        const doc = await this.stickerModel.findOneAndDelete({ filename })
        if (!doc) {
            throw new NotFoundException()
        }
        await this.storageService.delete(doc.filename)
    }

    async assertStickerExists(query: FilterQuery<StickerDocument>) {
        const exists = await this.stickerModel.exists(query)
        if (!exists) {
            throw new NotFoundException()
        }
    }
}
