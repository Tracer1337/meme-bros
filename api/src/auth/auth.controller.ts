import { Body, Controller, Get, Post, Put, Req, UseGuards } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { LoginDTO } from "./dto/login.dto"
import { ChangePasswordDTO } from "./dto/change-password.dto"
import { AuthorizedRequest } from "./interfaces/request.interface"
import { JwtAuthGuard } from "./jwt-auth.guard"
import { RolesGuard } from "../roles/roles.guard"
import { Roles } from "../roles/roles.decorator"
import { Role } from "../roles/role.enum"
import { UserEntity } from "../users/user.entity"

@Controller("auth")
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    @Post("login")
    @Roles(Role.PUBLIC)
    async login(@Body() loginDTO: LoginDTO) {
        return this.authService.login(loginDTO)
    }

    @Get("profile")
    @Roles(Role.ADMIN)
    getProfile(@Req() req: AuthorizedRequest) {
        return new UserEntity(req.user)
    }

    @Put("change-password")
    @Roles(Role.ADMIN)
    async changePassword(
        @Req() req: AuthorizedRequest,
        @Body() changePasswordDTO: ChangePasswordDTO
    ) {
        await this.authService.changePassword(
            req.user.username,
            changePasswordDTO
        )
    }
}
