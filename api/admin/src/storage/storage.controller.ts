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
        res.type(filename)
        this.storageService.getReadStream(filename).pipe(res)
    }
}
