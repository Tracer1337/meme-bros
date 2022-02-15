import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { Upload, UploadSchema } from "@meme-bros/api-lib"
import { UploadsController } from "./uploads.controller"
import { UploadsService } from "./uploads.service"

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: Upload.name,
            schema: UploadSchema
        }])
    ],
    controllers: [UploadsController],
    providers: [UploadsService]
})
export class UploadsModule {}
