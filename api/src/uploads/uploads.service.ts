import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { ImgurService } from "../imgur/imgur.service"
import { Upload, UploadDocument } from "./upload.schema"
import { UploadImageDTO } from "./dto/upload-image.dto"
import { GetAllUploadsDTO } from "./dto/get-all-uploads.dto"

@Injectable()
export class UploadsService {
    constructor(
        @InjectModel(Upload.name) private readonly uploadModel: Model<UploadDocument>,
        private readonly imgurService: ImgurService
    ) {}

    async uploadImage(uploadImageDTO: UploadImageDTO) {
        const res = await this.imgurService.uploadImage(uploadImageDTO.uri)
        if (!res.success) {
            throw new InternalServerErrorException()
        }
        await this.uploadModel.create(res.data)
        return res.data.link
    }

    async findAll(getAllUploadsDTO: GetAllUploadsDTO): Promise<UploadDocument[]> {
        return this.uploadModel.find()
            .limit(getAllUploadsDTO.per_page)
            .skip(getAllUploadsDTO.page * getAllUploadsDTO.per_page)
    }

    async delete(id: string) {
        const doc = await this.uploadModel.findOneAndDelete({ id })
        if (!doc) {
            throw new NotFoundException()
        }
        await this.imgurService.deleteImage(doc.deletehash)
    }
}
