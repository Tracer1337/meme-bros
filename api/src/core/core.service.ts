import { Inject, Injectable } from "@nestjs/common"
import { ConfigType } from "@nestjs/config"
import { HttpService} from "@nestjs/axios"
import type { AxiosResponse } from "axios"
import { firstValueFrom } from "rxjs"
import * as Core from "@meme-bros/core-types"
import { coreConfig } from "./core.config"

@Injectable()
export class CoreService {
    constructor(
        @Inject(coreConfig.KEY)
        private readonly config: ConfigType<typeof coreConfig>,
        private readonly httpService: HttpService
    ) {}

    url(path: string) {
        return `${this.config.uri}/${path}`
    }
    
    async render(canvas: Core.Canvas) {
        const res = await firstValueFrom<AxiosResponse<string>>(
            this.httpService.post(this.url("render"), canvas)
        )
        return res.data
    }
}
