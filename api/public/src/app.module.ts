import { ClassSerializerInterceptor, Module } from "@nestjs/common"
import { APP_INTERCEPTOR } from "@nestjs/core"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { MongooseModule } from "@nestjs/mongoose"
import { StorageModule } from "@meme-bros/api-shared"
import { TemplatesModule } from "./templates/templates.module"
import { configuration } from "./config/configuration"
import { configurationSchema } from "./config/configuration.schema"

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
        StorageModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                path: configService.get<string>("storage.path")
            }),
            inject: [ConfigService]
        }),
        TemplatesModule
    ],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: ClassSerializerInterceptor
        }
    ]
})
export class AppModule {}
