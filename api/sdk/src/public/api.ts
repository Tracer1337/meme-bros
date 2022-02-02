import axios from "axios"
import { createResource, url } from "../utils"
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
        all: createResource<Template[]>(
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
        
        one: createResource<Template, [string]>((id) => `template/${id}`),

        canvas: createResource<any, [Template]>(
            (template) => `templates/${template.id}/canvas`
        ),

        hash: createResource<string>(() => "templates/hash"),

        hashList: createResource<string[]>(() => "templates/list/hash"),

        newList: createResource<string[]>(() => "templates/list/new"),

        topList: createResource<string[]>(() => "templates/list/top"),

        hotList: createResource<string[]>(() => "templates/list/hot"),

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
