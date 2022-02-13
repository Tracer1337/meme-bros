import { AxiosInstance } from "axios"
import useSWR, { mutate } from "swr"

export class Getter<T, A extends any[] = []> {
    constructor(
        protected axios: AxiosInstance,
        protected path: (...args: A) => string
    ) {}
    
    protected async fetcher<T = any>(path: string) {
        const res = await this.axios.get<T>(path)
        return res.data
    }

    public url(...args: A) {
        return `${this.axios.defaults.baseURL}/${this.path(...args)}`
    }

    public get(...args: A) {
        return this.fetcher<T>(this.path(...args))
    }

    public use(...args: A) {
        return useSWR<T>(this.path(...args), this.fetcher.bind(this))
    }

    public mutate(...args: A) {
        return mutate<T>(this.path(...args))
    }
}
