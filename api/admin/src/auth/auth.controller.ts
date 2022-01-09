import { Controller, Get, Post, Req, UseGuards } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { LocalAuthGuard } from "./local-auth.guard"
import { Public } from "./public.decorator"

@Controller("auth")
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    @Public()
    @UseGuards(LocalAuthGuard)
    @Post("login")
    async login(@Req() req) {
        return this.authService.login(req.user)
    }

    @Get("profile")
    getProfile(@Req() req) {
        return req.user
    }
}
