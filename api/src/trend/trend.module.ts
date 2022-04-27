import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { HttpModule } from "@nestjs/axios"
import { MongooseModule } from "@nestjs/mongoose"
import { Trend, TrendSchema } from "../schemas/trend.schema"
import { TrendService } from "./trend.service"

@Module({
    imports: [
        HttpModule,
        ConfigModule,
        MongooseModule.forFeature([{
            name: Trend.name,
            schema: TrendSchema
        }])
    ],
    providers: [TrendService],
    exports: [TrendService]
})
export class TrendModule {}
