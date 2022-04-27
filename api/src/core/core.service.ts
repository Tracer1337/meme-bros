import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { HttpService} from "@nestjs/axios"
import type { AxiosResponse } from "axios"
import { firstValueFrom } from "rxjs"
import * as Core from "@meme-bros/core-types"

@Injectable()
export class CoreService {
    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService
    ) {}

    url(path: string) {
        const uri = this.configService.get<string>("core.uri")
        return `${uri}/${path}`
    }
    
    async render(canvas: Core.Canvas) {
        const res = await firstValueFrom<AxiosResponse<string>>(
            this.httpService.post(this.url("render"), canvas)
        )
        return res.data
    }
}
