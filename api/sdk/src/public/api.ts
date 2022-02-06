import globalAxios from "axios"
import { Editor } from "@meme-bros/shared"
import { Utils } from "../utils"
import { Template } from "./types"

const config = {
    host: ""
}

let axios = globalAxios.create()
let utils = new Utils(axios)

function init() {
    axios = globalAxios.create({
        baseURL: config.host
    })
    utils.axios = axios
}

export const api = {
    setConfig: (newConfig: typeof config) => {
        Object.assign(config, newConfig)
        init()
    },

    templates: {
        all: utils.getter<Template[]>(
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
        
        one: utils.getter<Template, [string]>((id) => `template/${id}`),

        canvas: utils.getter<Editor.Canvas, [Template]>(
            (template) => `templates/${template.id}/canvas`
        ),

        hash: utils.getter<string>(() => "templates/hash"),

        hashList: utils.getter<string[]>(() => "templates/list/hash"),

        newList: utils.getter<string[]>(() => "templates/list/new"),

        topList: utils.getter<string[]>(() => "templates/list/top"),

        hotList: utils.getter<string[]>(() => "templates/list/hot"),

        registerUse: async (template: Template) => {
            await axios.post(`templates/${template.id}/register-use`)
        }
    },

    storage: {
        templatePreview: {
            url: (template: Template) => utils.url(`storage/${template.previewFile}`)
        }
    }
}
