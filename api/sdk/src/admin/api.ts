import globalAxios from "axios"
import { Editor } from "@meme-bros/shared"
import { PaginationQuery, Utils } from "../utils"
import {
    AccessToken,
    Profile,
    Template,
    CreateTemplate
} from "./types"
import { mutate } from "swr"

const config = {
    token: "",
    host: ""
}

let axios = globalAxios.create()
const utils = new Utils(axios)

function init() {
    axios = globalAxios.create({
        baseURL: config.host
    })
    axios.interceptors.request.use((req) => {
        if (config.token && req.headers) {
            req.headers["Authorization"] = `Bearer ${config.token}`
        }
        return req
    })
    utils.axios = axios
}

const cachedPages = new Set<number>()

export const api = {
    setConfig: (newConfig: typeof config) => {
        Object.assign(config, newConfig)
        init()
    },

    auth: {
        login: async (payload: {
            username: string,
            password: string
        }) => {
            const res = await axios.post<AccessToken>("auth/login", payload)
            config.token = res.data.access_token
            return res.data
        },

        profile: utils.getter<Profile>(() => "auth/profile"),

        changePassword: async (payload: {
            oldPassword: string,
            newPassword: string
        }) => {
            await axios.put("auth/change-password", payload)
        }
    },

    templates: {
        all: utils.getter<Template[], [] | [PaginationQuery]>(
            (query?: PaginationQuery) => {
                if (query?.page === undefined) return "templates"
                cachedPages.add(query.page)
                return `templates?page=${query.page}&per_page=3`
            },
            {
                mutate: async (query?: PaginationQuery) => {
                    if (query) return mutate(`templates?page=${query.page}&per_page=3`)
                    cachedPages.forEach((page) => mutate(`templates?page=${page}&per_page=3`))
                    cachedPages.clear()
                    return []
                }
            }
        ),
        
        one: utils.getter<Template, [string]>((id) => `templates/${id}`),

        canvas: utils.getter<Editor.Canvas, [string]>((id) => `templates/${id}/canvas`),

        create: async (payload: CreateTemplate) => {
            const res = await axios.post("templates", payload)
            return res.data
        },

        update: async (
            template: Template,
            payload: Partial<CreateTemplate>
        ) => {
            const res = await axios.put(`templates/${template.id}`, payload)
            return res.data
        },

        delete: async (template: Template) => {
            await axios.delete(`templates/${template.id}`)
        }
    },

    storage: {
        templatePreview: {
            url: (template: Template) => utils.url(`storage/${template.previewFile}`)
        }
    }
}
