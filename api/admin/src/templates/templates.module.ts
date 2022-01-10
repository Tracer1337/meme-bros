import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { StorageModule, Template, TemplateSchema } from "@meme-bros/api-shared"
import { TemplatesController } from "./templates.controller"
import { TemplatesService } from "./templates.service"

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: Template.name,
            schema: TemplateSchema
        }]),
        StorageModule
    ],
    controllers: [TemplatesController],
    providers: [TemplatesService]
})
export class TemplatesModule {}
