import { Controller, Get, Query } from "@nestjs/common"
import { UploadsService } from "./uploads.service"
import { UploadEntity } from "./entities/upload.entity"
import { GetAllUploadsDTO } from "./dto/get-all-uploads.dto"

@Controller("uploads")
export class UploadsController {
    constructor(
        private readonly uploadsService: UploadsService
    ) {}

    @Get()
    async uploadImage(@Query() getAllUploadsDTO: GetAllUploadsDTO) {
        const docs = await this.uploadsService.findAll(getAllUploadsDTO)
        return docs.map((doc) => new UploadEntity(doc))
    }
}
