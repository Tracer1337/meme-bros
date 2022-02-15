import { Body, Controller, Post } from "@nestjs/common"
import { UploadsService } from "./uploads.service"
import { UploadImageDTO } from "./dto/upload-image.dto"

@Controller("uploads")
export class UploadsController {
    constructor(
        private readonly uploadsService: UploadsService
    ) {}

    @Post("/")
    async uploadImage(@Body() uploadImageDTO: UploadImageDTO) {
        return await this.uploadsService.uploadImage(uploadImageDTO)
    }
}
