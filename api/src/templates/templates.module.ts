import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { PreviewsModule } from "../previews/previews.module"
import { TrendModule } from "../trend/trend.module"
import { Template, TemplateSchema } from "./template.schema"
import { TemplatesController } from "./templates.controller"
import { TemplatesService } from "./templates.service"

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: Template.name,
            schema: TemplateSchema
        }]),
        PreviewsModule,
        TrendModule
    ],
    controllers: [TemplatesController],
    providers: [TemplatesService]
})
export class TemplatesModule {}
