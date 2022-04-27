import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { ImgurModule } from "../imgur/imgur.module"
import { Upload, UploadSchema } from "../schemas/upload.schema"
import { UploadsController } from "./uploads.controller"
import { UploadsService } from "./uploads.service"

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: Upload.name,
            schema: UploadSchema
        }]),
        ImgurModule
    ],
    controllers: [UploadsController],
    providers: [UploadsService]
})
export class UploadsModule {}
