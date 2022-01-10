import { Injectable, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { createHash } from "../lib/crypto"
import { UsersService } from "../users/users.service"
import { LoginDTO } from "./dto/login.dto"
import { Payload } from "./interfaces/payload.interface"

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) {}

    async login(loginDTO: LoginDTO) {
        const user = await this.validateUser(
            loginDTO.username,
            loginDTO.password
        )
        if (!user) {
            throw new UnauthorizedException()
        }
        const payload: Payload = {
            username: user.username,
            sub: user.id
        }
        return {
            access_token: this.jwtService.sign(payload)
        }
    }

    async validateUser(username: string, password: string) {
        const user = await this.usersService.findOne(username)
        if (user && user.password === createHash(password)) {
            return user
        }
        return null
    }
}
