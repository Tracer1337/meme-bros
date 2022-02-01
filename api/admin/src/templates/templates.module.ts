import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { ConfigModule } from "@nestjs/config"
import { Template, TemplateSchema } from "@meme-bros/api-lib"
import { PreviewsModule } from "../previews/previews.module"
import { TemplatesController } from "./templates.controller"
import { TemplatesService } from "./templates.service"

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: Template.name,
            schema: TemplateSchema
        }]),
        ConfigModule,
        PreviewsModule
    ],
    controllers: [TemplatesController],
    providers: [TemplatesService]
})
export class TemplatesModule {}
