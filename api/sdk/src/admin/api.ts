import axios from "axios"
import useSWR, { mutate } from "swr"
import { createResource, url } from "../utils"
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

        getProfile: async () => {
            const res = await axios.get<Profile>("auth/profile")
            return res.data
        },

        changePassword: async (payload: {
            oldPassword: string,
            newPassword: string
        }) => {
            await axios.put("auth/change-password", payload)
        }
    },

    templates: {
        all: createResource<Template[]>(() => "templates"),
        
        one: createResource<Template, [string]>((id) => `templates/${id}`),

        canvas: createResource<any, [string]>((id) => `templates/${id}/canvas`),

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
