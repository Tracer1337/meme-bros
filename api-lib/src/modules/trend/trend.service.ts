import { Inject, Injectable } from "@nestjs/common"
import { HttpService} from "@nestjs/axios"
import type { AxiosResponse } from "axios"
import { firstValueFrom } from "rxjs"
import { TREND_OPTIONS_KEY } from "./constants"
import { TrendModuleOptions } from "./interfaces/trend-module-options.interface"

@Injectable()
export class TrendService {
    constructor(
        @Inject(TREND_OPTIONS_KEY) private readonly options: TrendModuleOptions,
        private readonly httpService: HttpService
    ) {}

    url(path: string) {
        return `${this.options.uri}/${path}`
    }

    async addSubject(id: string) {
        await firstValueFrom(
            this.httpService.put(this.url(`subjects/${id}`))
        )
    }

    async removeSubject(id: string) {
        await firstValueFrom(
            this.httpService.delete(this.url(`subjects/${id}`))
        )
    }

    async syncSubjects(ids: string[]) {
        await firstValueFrom(
            this.httpService.post(this.url("subjects/sync"), { ids })
        )
    }

    async hit(id: string) {
        await firstValueFrom(
            this.httpService.post(this.url(`hit/${id}`))
        )
    }

    async getTrend() {
        const res = await firstValueFrom<AxiosResponse<string[]>>(
            this.httpService.get(this.url("trend"))
        )
        return res.data
    }
}
