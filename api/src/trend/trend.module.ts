import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { HttpModule } from "@nestjs/axios"
import { MongooseModule } from "@nestjs/mongoose"
import { Trend, TrendSchema } from "./trend.schema"
import { TrendService } from "./trend.service"
import { templatesConfig } from "../templates/templates.config"

@Module({
    imports: [
        HttpModule,
        ConfigModule.forFeature(templatesConfig),
        MongooseModule.forFeature([{
            name: Trend.name,
            schema: TrendSchema
        }])
    ],
    providers: [TrendService],
    exports: [TrendService]
})
export class TrendModule {}
