import { Controller, Delete, Get, Param, Query, UseGuards } from "@nestjs/common"
import { UploadsService } from "./uploads.service"
import { UploadEntity } from "./entities/upload.entity"
import { GetAllUploadsDTO } from "./dto/get-all-uploads.dto"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"

@Controller("uploads")
@UseGuards(JwtAuthGuard)
export class UploadsController {
    constructor(
        private readonly uploadsService: UploadsService
    ) {}

    @Get()
    async getAll(@Query() getAllUploadsDTO: GetAllUploadsDTO) {
        const docs = await this.uploadsService.findAll(getAllUploadsDTO)
        return docs.map((doc) => new UploadEntity(doc))
    }

    @Delete(":id")
    async delete(@Param("id") id: string) {
        await this.uploadsService.delete(id)
    }
}
