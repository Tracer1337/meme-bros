import axios from "axios"
import useSWR, { mutate, SWRResponse } from "swr"

export function url(path: string) {
    return `${axios.defaults.baseURL}/${path}`
}

export async function fetcher<T = any>(path: string) {
    const res = await axios.get<T>(path)
    return res.data
}

export type Getter<T, A extends any[]> = {
    url: (...args: A) => string,
    get: (...args: A) => Promise<T>,
    use: (...args: A) => SWRResponse<T, any>,
    mutate: (...args: A) => Promise<T | undefined>
}

export function getter<T, A extends any[] = []>(
    getPath: (...args: A) => string,
    overrides: Partial<Getter<T, A>> = {}
): Getter<T, A> {
    return {
        url: (...args: A) => url(getPath(...args)),
        get: (...args: A) => fetcher<T>(getPath(...args)),
        use: (...args: A) => useSWR<T>(getPath(...args), fetcher),
        mutate: (...args: A) => mutate<T>(getPath(...args)),
        ...overrides
    }
}
