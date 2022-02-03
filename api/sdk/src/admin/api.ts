import axios from "axios"
import { getter, url } from "../utils"
import {
    AccessToken,
    Profile,
    Template,
    CreateTemplate
} from "./types"

const config = {
    token: "",
    host: ""
}

axios.interceptors.request.use((req) => {
    if (config.token && req.headers) {
        req.headers["Authorization"] = `Bearer ${config.token}`
    }
    return req
})

export const api = {
    setConfig: (newConfig: typeof config) => {
        Object.assign(config, newConfig)
        axios.defaults.baseURL = config.host
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

        profile: getter<Profile>(() => "auth/profile"),

        changePassword: async (payload: {
            oldPassword: string,
            newPassword: string
        }) => {
            await axios.put("auth/change-password", payload)
        }
    },

    templates: {
        all: getter<Template[]>(() => "templates"),
        
        one: getter<Template, [string]>((id) => `templates/${id}`),

        canvas: getter<any, [string]>((id) => `templates/${id}/canvas`),

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
            url: (template: Template) => url(`storage/${template.previewFile}`)
        }
    }
}
