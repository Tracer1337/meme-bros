import { AxiosInstance } from "axios"

export abstract class Resource<C> {
    constructor(
        protected axios: AxiosInstance,
        protected config: C
    ) {}
}
