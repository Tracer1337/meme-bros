import axios from "axios"
import useSWR, { mutate } from "swr"
import { Template } from "./types"

const config = {
    host: ""
}

function url(path: string) {
    return `${config.host}/${path}`
}

async function fetcher<T = any>(path: string) {
    const res = await axios.get<T>(path)
    return res.data
}

export const api = {
    setConfig: (newConfig: typeof config) => {
        Object.assign(config, newConfig)
        axios.defaults.baseURL = config.host
    },

    templates: {
        all: {
            get: async (hashes?: string[]) => {
                const res = await axios.get<Template[]>("templates", {
                    params: { hashes }
                })
                return res.data
            },
            use: () => useSWR<Template[]>("templates", fetcher),
            mutate: () => mutate<Template[]>("templates")
        },

        map: {
            get: async (hashes?: string[]) => {
                const res = await axios.get<Template[]>("templates", {
                    params: { hashes }
                })
                return Object.fromEntries(
                    res.data.map((template) => [template.id, template])
                )
            }
        },
        
        one: {
            get: (id: string) => fetcher<Template>(`templates/${id}`),
            use: (id: string) => useSWR<Template>(`templates/${id}`, fetcher),
            mutate: (id: string) => mutate<Template>(`templates/${id}`)
        },

        canvas: {
            url: (template: Template) => url(`templates/${template.id}/canvas`)
        },

        hash: {
            get: () => fetcher<string>("templates/hash")
        },

        hashList: {
            get: () => fetcher<string[]>("templates/list/hash")
        },

        newList: {
            get: () => fetcher<string[]>("templates/list/new")
        },

        topList: {
            get: () => fetcher<string[]>("templates/list/top")
        },

        hotList: {
            get: () => fetcher<string[]>("templates/list/hot")
        },

        registerUse: async (template: Template) => {
            await axios.post(`templates/${template.id}/register-use`)
        }
    },

    storage: {
        templatePreview: {
            url: (template: Template) => url(`storage/${template.previewFile}`)
        }
    }
}
