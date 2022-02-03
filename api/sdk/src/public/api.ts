import axios from "axios"
import { getter, url } from "../utils"
import { Template } from "./types"

const config = {
    host: ""
}

export const api = {
    setConfig: (newConfig: typeof config) => {
        Object.assign(config, newConfig)
        axios.defaults.baseURL = config.host
    },

    templates: {
        all: getter<Template[]>(
            () => "templates",
            {
                get: async (hashes?: string[]) => {
                    const res = await axios.get<Template[]>("templates", {
                        params: { hashes }
                    })
                    return res.data
                }
            }
        ),

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
        
        one: getter<Template, [string]>((id) => `template/${id}`),

        canvas: getter<any, [Template]>(
            (template) => `templates/${template.id}/canvas`
        ),

        hash: getter<string>(() => "templates/hash"),

        hashList: getter<string[]>(() => "templates/list/hash"),

        newList: getter<string[]>(() => "templates/list/new"),

        topList: getter<string[]>(() => "templates/list/top"),

        hotList: getter<string[]>(() => "templates/list/hot"),

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
