import { Body, Controller, Get, Post, Req } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { LoginDTO } from "./dto/login.dto"
import { Public } from "./public.decorator"
import { AuthorizedRequest } from "./interfaces/request.interface"

@Controller("auth")
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
}
