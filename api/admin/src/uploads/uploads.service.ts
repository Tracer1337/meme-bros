import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { ImgurService, Upload, UploadDocument } from "@meme-bros/api-lib"
import { GetAllUploadsDTO } from "./dto/get-all-uploads.dto"

@Injectable()
export class UploadsService {
    constructor(
        @InjectModel(Upload.name) private readonly uploadModel: Model<UploadDocument>,
        private readonly imgurService: ImgurService
    ) {}

    async findAll(getAllUploadsDTO: GetAllUploadsDTO): Promise<UploadDocument[]> {
        return this.uploadModel.find()
            .limit(getAllUploadsDTO.per_page)
            .skip(getAllUploadsDTO.page * getAllUploadsDTO.per_page)
    }

    async delete(id: string) {
        const doc = await this.uploadModel.findOneAndDelete({ id })
        await this.imgurService.deleteImage(doc.deletehash)
    }
}
