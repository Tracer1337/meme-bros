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
    if (result.statusCode && result.statusCode >= 400) {
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
}
