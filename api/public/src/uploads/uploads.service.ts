import { Injectable, InternalServerErrorException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { ImgurService, Upload, UploadDocument } from "@meme-bros/api-lib"
import { UploadImageDTO } from "./dto/upload-image.dto"

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
}
