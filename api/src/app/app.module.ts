import { Module } from "@nestjs/common"
import { APP_INTERCEPTOR } from "@nestjs/core"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { MongooseModule } from "@nestjs/mongoose"
import { ThrottlerModule } from "@nestjs/throttler"
import { appConfig } from "../app/app.config"
import { StorageModule } from "../storage/storage.module"
import { UsersModule } from "../users/users.module"
import { AuthModule } from "../auth/auth.module"
import { TemplatesModule } from "../templates/templates.module"
import { StickersModule } from "../stickers/stickers.module"
import { UploadsModule } from "../uploads/uploads.module"
import { ClassSerializerInterceptor } from "./class-serializer.interceptor"

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [appConfig]
        }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                uri: configService.get<string>("app.database.uri")
            }),
            inject: [ConfigService]
        }),
        ThrottlerModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                ttl: configService.get<number>("app.throttle.ttl"),
                limit: configService.get<number>("app.throttle.limit")
            }),
            inject: [ConfigService]
        }),
        StorageModule,
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
