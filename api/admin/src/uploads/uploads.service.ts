import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { Upload, UploadDocument } from "@meme-bros/api-lib"
import { GetAllUploadsDTO } from "./dto/get-all-uploads.dto"

@Injectable()
export class UploadsService {
    constructor(
        @InjectModel(Upload.name) private readonly uploadModel: Model<UploadDocument>
    ) {}

    async findAll(getAllUploadsDTO: GetAllUploadsDTO): Promise<UploadDocument[]> {
        return this.uploadModel.find()
            .limit(getAllUploadsDTO.per_page)
            .skip(getAllUploadsDTO.page * getAllUploadsDTO.per_page)
    }
}
