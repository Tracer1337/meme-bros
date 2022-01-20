import { Injectable, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { createHash } from "@meme-bros/api-shared"
import { UsersService } from "../users/users.service"
import { ChangePasswordDTO } from "./dto/change-password.dto"
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
        const payload: Payload = {
            username: user.username,
            sub: user.id
        }
        return {
            access_token: this.jwtService.sign(payload)
        }
    }

    async changePassword(
        username: string,
        changePasswordDTO: ChangePasswordDTO
    ) {
        const user = await this.validateUser(
            username,
            changePasswordDTO.oldPassword
        )
        user.password = createHash(changePasswordDTO.newPassword)
        await user.save()
    }

    async validateUser(username: string, password: string) {
        const user = await this.usersService.findOne(username)
        if (!user || user.password !== createHash(password)) {
            throw new UnauthorizedException()
        }
        return user
    }
}
