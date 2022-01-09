import { Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { createHash } from "../lib/crypto"
import { UsersService } from "../users/users.service"

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) {}

    async validateUser(username: string, password: string) {
        const user = await this.usersService.findOne(username)
        if (user && user.password === createHash(password)) {
            return user
        }
        return null
    }

    async login(user: any) {
        const payload = {
            username: user.username,
            sub: user.id
        }
        return {
            access_token: this.jwtService.sign(payload)
        }
    }
}
