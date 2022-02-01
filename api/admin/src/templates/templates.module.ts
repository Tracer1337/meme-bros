import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { Template, TemplateSchema } from "@meme-bros/api-lib"
import { TemplatesController } from "./templates.controller"
import { TemplatesService } from "./templates.service"
import { ConfigModule } from "@nestjs/config"

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: Template.name,
            schema: TemplateSchema
        }]),
        ConfigModule
    ],
    controllers: [TemplatesController],
    providers: [TemplatesService]
})
export class TemplatesModule {}
