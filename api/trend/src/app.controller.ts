import { Controller, Delete, Get, Param, Post, Put } from "@nestjs/common"
import { AppService } from "./app.service";

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService
    ) {}

    @Put("subjects/:id")
    async addSubject(@Param("id") id: string) {
        await this.appService.addSubject(id)
    }

    @Delete("subjects/:id")
    async removeSubject(@Param("id") id: string) {
        await this.appService.removeSubject(id)
    }

    @Post("hit/:id")
    async hit(@Param("id") id: string) {
        await this.appService.hit(id)
    }
    
    @Get("trend")    
    async getTrend() {
        return this.appService.getTrend()
    }
}
