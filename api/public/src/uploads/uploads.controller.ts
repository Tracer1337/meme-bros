import { Body, Controller, Post, UseGuards } from "@nestjs/common"
import { ThrottlerGuard } from "@nestjs/throttler"
import { UploadsService } from "./uploads.service"
import { UploadImageDTO } from "./dto/upload-image.dto"

@Controller("uploads")
export class UploadsController {
    constructor(
        private readonly uploadsService: UploadsService
    ) {}

    @Post("/")
    @UseGuards(ThrottlerGuard)
    async uploadImage(@Body() uploadImageDTO: UploadImageDTO) {
        return await this.uploadsService.uploadImage(uploadImageDTO)
    }
}
