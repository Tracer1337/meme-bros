import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { PassportStrategy } from "@nestjs/passport"
import { Strategy, ExtractJwt } from "passport-jwt"
import { Payload } from "./interfaces/payload.interface"
import { AuthorizedRequest } from "./interfaces/request.interface"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        readonly configService: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>("jwt.secret")
        })
    }

    validate(payload: Payload): AuthorizedRequest["user"] {
        return {
            id: payload.sub,
            username: payload.username
        }
    }
}
