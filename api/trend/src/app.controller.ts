import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common"
import { AppService } from "./app.service"
import { SyncSubjectsDTO } from "./dto/sync-subjects.dto"

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

    @Post("subjects/sync")
    async syncSubjects(@Body() syncSubjectsDTO: SyncSubjectsDTO) {
        await this.appService.syncSubjects(syncSubjectsDTO)
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
