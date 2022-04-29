import { Controller, Get, Param, Res } from "@nestjs/common"
import { Response } from "express"
import { StorageService } from "./storage.service"

@Controller("storage")
export class StorageController {
    constructor(
        private readonly storageService: StorageService
    ) {}

    @Get(":filename")
    async getFile(
        @Param("filename") filename: string,
        @Res() res: Response
    ) {
        await this.storageService.assertFileExists(filename)
        res.type(filename)
        const stream = await this.storageService.get(filename)
        stream.pipe(res)
    }
}
