import { Body, Controller, Post } from "@nestjs/common"
import { UploadService } from "./upload.service"
import { UploadImageDTO } from "./dto/upload-image.dto"

@Controller("upload")
export class UploadController {
    constructor(
        private readonly uploadService: UploadService
    ) {}

    @Post("/")
    async uploadImage(@Body() uploadImageDTO: UploadImageDTO) {
        return await this.uploadService.uploadImage(uploadImageDTO)
    }
}
