import { ClassSerializerInterceptor, Module } from "@nestjs/common"
import { APP_INTERCEPTOR } from "@nestjs/core"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { MongooseModule } from "@nestjs/mongoose"
import {
    CoreModule,
    ImgurModule,
    StorageModule,
    TrendModule
} from "@meme-bros/api-lib"
import { configuration } from "./config/configuration"
import { configurationSchema } from "./config/configuration.schema"
import { UsersModule } from "./users/users.module"
import { AuthModule } from "./auth/auth.module"
import { TemplatesModule } from "./templates/templates.module"
import { StickersModule } from "./stickers/stickers.module"
import { UploadsModule } from "./uploads/uploads.module"

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
        TrendModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                name: configService.get<string>("templates.trend.name"),
                damping: configService.get<number>("templates.trend.damping"),
                reduction: configService.get<number>("templates.trend.reduction")
            }),
            inject: [ConfigService]
        }),
        CoreModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                uri: configService.get<string>("core.uri")
            }),
            inject: [ConfigService]
        }),
        ImgurModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                clientId: configService.get<string>("imgur.clientId")
            }),
            inject: [ConfigService]
        }),
        UsersModule,
        AuthModule,
        TemplatesModule,
        StickersModule,
        UploadsModule
    ],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: ClassSerializerInterceptor
        }
    ]
})
export class AppModule {}
