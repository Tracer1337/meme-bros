import { AxiosInstance } from "axios"
import useSWR, { mutate, SWRResponse } from "swr"

type Getter<T, A extends any[]> = {
    url: (...args: A) => string,
    get: (...args: A) => Promise<T>,
    use: (...args: A) => SWRResponse<T, any>,
    mutate: (...args: A) => Promise<T | undefined>
}

export class Utils {
    constructor(public axios: AxiosInstance) {}

    url(path: string) {
        return `${this.axios.defaults.baseURL}/${path}`
    }
    
    async fetcher<T = any>(path: string) {
        const res = await this.axios.get<T>(path)
        return res.data
    }
    
    getter<T, A extends any[] = []>(
        getPath: (...args: A) => string,
        overrides: Partial<Getter<T, A>> = {}
    ): Getter<T, A> {
        return {
            url: (...args: A) => this.url(getPath(...args)),
            get: (...args: A) => this.fetcher<T>(getPath(...args)),
            use: (...args: A) => useSWR<T>(getPath(...args), this.fetcher.bind(this)),
            mutate: (...args: A) => mutate<T>(getPath(...args)),
            ...overrides
        }
    }
}

export type PaginationQuery = {
    page?: number
}
