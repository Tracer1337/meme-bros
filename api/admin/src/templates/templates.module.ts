import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { StorageModule } from "../storage/storage.module"
import { TemplatesController } from "./templates.controller"
import { TemplatesService } from "./templates.service"
import { Template, TemplateSchema } from "./schemas/template.schema"

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
