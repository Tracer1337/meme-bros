import { Inject, Injectable } from "@nestjs/common"
import { HttpService} from "@nestjs/axios"
import type { AxiosResponse } from "axios"
import { firstValueFrom } from "rxjs"
import * as Core from "@meme-bros/core"
import { CORE_OPTIONS_KEY } from "./constants"
import { CoreModuleOptions } from "./interfaces/core-module-options.interface"

@Injectable()
export class CoreService {
    constructor(
        @Inject(CORE_OPTIONS_KEY) private readonly options: CoreModuleOptions,
        private readonly httpService: HttpService
    ) {}

    url(path: string) {
        return `${this.options.uri}/${path}`
    }
    
    async render(canvas: Core.Canvas) {
        const res = await firstValueFrom<AxiosResponse<string>>(
            this.httpService.post(this.url("render"), canvas)
        )
        return res.data
    }
}
