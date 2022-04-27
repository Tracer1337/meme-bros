import { Inject, Injectable, UnauthorizedException } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { Strategy, ExtractJwt } from "passport-jwt"
import { UsersService } from "src/users/users.service"
import { Role } from "../roles/role.enum"
import { Payload } from "./interfaces/payload.interface"
import { AuthorizedRequest } from "./interfaces/request.interface"
import { authConfig } from "./auth.config"
import { ConfigType } from "@nestjs/config"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject(authConfig.KEY)
        readonly config: ConfigType<typeof authConfig>,
        private readonly usersService: UsersService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.jwt.secret
        })
    }

    async validate(payload: Payload): Promise<AuthorizedRequest["user"]> {
        const user = await this.usersService.findOne(payload.username)
        if (!user) {
            throw new UnauthorizedException()
        }
        return {
            id: payload.sub,
            username: payload.username,
            roles: new Set([Role.ADMIN])
        }
    }
}
