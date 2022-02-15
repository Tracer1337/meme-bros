import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { PaginationDTO, Upload, UploadDocument } from "@meme-bros/api-lib"

@Injectable()
export class UploadsService {
    constructor(
        @InjectModel(Upload.name) private readonly uploadModel: Model<UploadDocument>
    ) {}

    async findAll(paginationDTO: PaginationDTO): Promise<UploadDocument[]> {
        return this.uploadModel.find()
            .limit(paginationDTO.per_page)
            .skip(paginationDTO.page * paginationDTO.per_page)
    }
}
