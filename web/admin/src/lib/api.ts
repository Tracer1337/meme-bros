import type { Editor } from "@meme-bros/client-lib"
import { Storage } from "./storage"

const API_HOST = process.env.API_HOST || "http://localhost:5000"

function url(path: string) {
    return `${API_HOST}/${path}`
}

async function fetchJSON<T>(
    ...[input, init]: Parameters<typeof fetch>
): Promise<T> {
    const res = await fetch(input, {
        ...(init || {}),
        headers: {
            ...(init?.headers || {}),
            "Authorization": "Bearer " + Storage.get(Storage.Keys.TOKEN)
        }
    })
    let result: any
    try {
        result = await res.json()
    } catch {
        result = null
    }
    if (result?.statusCode && result.statusCode >= 400) {
        throw result
    }
    return result as T
}

function postJSON<T>(url: string, body: any) {
    return fetchJSON<T>(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    })
}

function putJSON<T>(url: string, body: any) {
    return fetchJSON<T>(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    })
}

export function fetcher(path: string) {
    return fetchJSON<any>(url(path))
}

export namespace API {
    export type Error = {
        error: string,
        message: string[],
        statusCode: number
    }

    export type Profile = {
        id: string,
        username: string
    }

    export type AccessToken = {
        access_token: string
    }

    export type Template = {
        id: string,
        name: string,
        hash: string,
        uses: number,
        previewFile: string
    }

    export type CreateTemplate = {
        name: string,
        canvas: Omit<Editor.Canvas, "pixelRatio">
    }

    export async function login(payload: {
        username: string,
        password: string
    }) {
        return await postJSON<AccessToken>(url("auth/login"), payload)
    }

    export async function getProfile() {
        return await fetchJSON<Profile>(url("auth/profile"))
    }

    export async function changePassword(payload: {
        oldPassword: string,
        newPassword: string
    }) {
        await putJSON(url("auth/change-password"), payload)
    }

    export function getPreviewURL(template: API.Template) {
        return url("storage/" + template.previewFile)
    }

    export async function createTemplate(payload: CreateTemplate) {
        return await postJSON<Template>(url("templates"), payload)
    }

    export async function updateTemplate(
        id: string,
        payload: Partial<CreateTemplate>
    ) {
        return await putJSON<Template>(url(`templates/${id}`), payload)
    }

    export async function deleteTemplate(id: string) {
        await fetchJSON(url(`templates/${id}`), { method: "DELETE" })
    }
}
