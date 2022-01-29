import { ClassSerializerInterceptor, Module } from "@nestjs/common"
import { APP_INTERCEPTOR } from "@nestjs/core"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { MongooseModule } from "@nestjs/mongoose"
import { configuration } from "./config/configuration"
import { configurationSchema } from "./config/configuration.schema"
import { AppController } from "./app.controller" 
import { AppService } from "./app.service"
import { Trend, TrendSchema } from "@meme-bros/api-lib"

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [configuration],
            validationSchema: configurationSchema
        }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                uri: configService.get<string>("database.uri")
            }),
            inject: [ConfigService]
        }),
        MongooseModule.forFeature([{
            name: Trend.name,
            schema: TrendSchema
        }])
    ],
    controllers: [AppController],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: ClassSerializerInterceptor
        },
        AppService
    ]
})
export class AppModule {}
