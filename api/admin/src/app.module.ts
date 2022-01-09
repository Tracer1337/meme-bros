import { ClassSerializerInterceptor, Module } from "@nestjs/common"
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { MongooseModule } from "@nestjs/mongoose"
import { UsersModule } from "./users/users.module"
import { AuthModule } from "./auth/auth.module"
import { StorageModule } from "./storage/storage.module"
import { TemplatesModule } from "./templates/templates.module"
import { configuration } from "./config/configuration"
import { configurationSchema } from "./config/configuration.schema"
import { JwtAuthGuard } from "./auth/jwt-auth.guard"

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [configuration],
            validationSchema: configurationSchema
        }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>("database.uri")
            }),
            inject: [ConfigService]
        }),
        UsersModule,
        AuthModule,
        StorageModule,
        TemplatesModule
    ],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: ClassSerializerInterceptor
        },
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard
        }
    ]
})
export class AppModule {}
