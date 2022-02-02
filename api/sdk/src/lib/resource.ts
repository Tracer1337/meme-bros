import axios, { AxiosInstance } from "axios"

abstract class Resource {
    protected readonly axios: AxiosInstance

    constructor(protected readonly host: string) {
        this.axios = axios.create({
            baseURL: host
        })
    }

    protected url(path: string) {
        return `${this.host}/${path}`
    }
}

export default Resource
