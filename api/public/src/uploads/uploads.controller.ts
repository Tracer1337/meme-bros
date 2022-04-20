import { Body, Controller, Post, UseGuards, Get, Delete, Query, Param } from "@nestjs/common"
import { ThrottlerGuard } from "@nestjs/throttler"
import { UploadsService } from "./uploads.service"
import { UploadImageDTO } from "./dto/upload-image.dto"
import { GetAllUploadsDTO } from "./dto/get-all-uploads.dto"
import { UploadEntity } from "./entities/upload.entity"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"

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

    @Get()
    @UseGuards(JwtAuthGuard)
    async getAll(@Query() getAllUploadsDTO: GetAllUploadsDTO) {
        const docs = await this.uploadsService.findAll(getAllUploadsDTO)
        return docs.map((doc) => new UploadEntity(doc))
    }

    @Delete(":id")
    @UseGuards(JwtAuthGuard)
    async delete(@Param("id") id: string) {
        await this.uploadsService.delete(id)
    }
}
