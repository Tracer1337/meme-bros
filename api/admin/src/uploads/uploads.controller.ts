import { PaginationDTO } from "@meme-bros/api-lib"
import { Controller, Get, Query } from "@nestjs/common"
import { UploadsService } from "./uploads.service"
import { UploadEntity } from "./entities/upload.entity"

@Controller("uploads")
export class UploadsController {
    constructor(
        private readonly uploadsService: UploadsService
    ) {}

    @Get()
    async uploadImage(@Query() paginationDTO: PaginationDTO) {
        const docs = await this.uploadsService.findAll(paginationDTO)
        return docs.map((doc) => new UploadEntity(doc))
    }
}
