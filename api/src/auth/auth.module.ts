import { Module } from "@nestjs/common"
import { PassportModule } from "@nestjs/passport"
import { JwtModule } from "@nestjs/jwt"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"
import { UsersModule } from "../users/users.module"
import { JwtStrategy } from "./jwt.strategy"
import { authConfig } from "./auth.config"

@Module({
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>("auth.jwt.secret"),
                signOptions: {
                    expiresIn: "7d"
                }
            }),
            inject: [ConfigService]
        }),
        ConfigModule.forFeature(authConfig)
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy]
})
export class AuthModule {}
