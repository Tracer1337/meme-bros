import { Body, Controller, Post, UseGuards, Get, Delete, Query, Param } from "@nestjs/common"
import { ThrottlerGuard } from "@nestjs/throttler"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"
import { RolesGuard } from "../roles/roles.guard"
import { Roles } from "../roles/roles.decorator"
import { Role } from "../roles/role.enum"
import { UploadsService } from "./uploads.service"
import { UploadImageDTO } from "./dto/upload-image.dto"
import { GetAllUploadsDTO } from "./dto/get-all-uploads.dto"
import { UploadEntity } from "./upload.entity"

@Controller("uploads")
@UseGuards(JwtAuthGuard, RolesGuard)
export class UploadsController {
    constructor(
        private readonly uploadsService: UploadsService
    ) {}

    @Post("/")
    @UseGuards(ThrottlerGuard)
    @Roles(Role.PUBLIC)
    async uploadImage(@Body() uploadImageDTO: UploadImageDTO) {
        return await this.uploadsService.uploadImage(uploadImageDTO)
    }

    @Get()
    @Roles(Role.ADMIN)
    async getAll(@Query() getAllUploadsDTO: GetAllUploadsDTO) {
        const docs = await this.uploadsService.findAll(getAllUploadsDTO)
        return docs.map((doc) => new UploadEntity(doc))
    }

    @Delete(":id")
    @Roles(Role.ADMIN)
    async delete(@Param("id") id: string) {
        await this.uploadsService.delete(id)
    }
}
