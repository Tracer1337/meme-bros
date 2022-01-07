import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { TemplatesController } from "./templates.controller"
import { TemplatesService } from "./templates.service"
import { Template, TemplateSchema } from "./schemas/template.schema"

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: Template.name,
            schema: TemplateSchema
        }])
    ],
    controllers: [TemplatesController],
    providers: [TemplatesService]
})
export class TemplatesModule {}
