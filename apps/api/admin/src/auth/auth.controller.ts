import { Body, Controller, Get, Post, Put, Req, UseGuards } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { LoginDTO } from "./dto/login.dto"
import { ChangePasswordDTO } from "./dto/change-password.dto"
import { Public } from "./public.decorator"
import { AuthorizedRequest } from "./interfaces/request.interface"
import { JwtAuthGuard } from "./jwt-auth.guard"

@Controller("auth")
@UseGuards(JwtAuthGuard)
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    @Public()
    @Post("login")
    async login(@Body() loginDTO: LoginDTO) {
        return this.authService.login(loginDTO)
    }

    @Get("profile")
    getProfile(@Req() req: AuthorizedRequest) {
        return req.user
    }

    @Put("change-password")
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
