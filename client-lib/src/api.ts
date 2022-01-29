import type { Editor } from "./editor"

const API_HOST = process.env.API_HOST || "http://10.0.2.2:6000"

function url(path: string) {
    return `${API_HOST}/${path}`
}

async function fetchText(url: string) {
    const res = await fetch(url)
    return await res.text()
}

async function fetchJSON<T>(url: string) {
    const res = await fetch(url)
    return await res.json() as T
}

export namespace API {
    export type Template = {
        id: string,
        name: string,
        hash: string,
        previewFile: string,
        canvas: Editor.Canvas
    }

    export function getTemplates(hashes?: string[]) {
        const params = new URLSearchParams()
        hashes?.forEach((hash) => params.append("hashes", hash))
        return fetchJSON<API.Template[]>(url("templates?" + params.toString()))
    }

    export async function getTemplatesAsMap(
        ...args: Parameters<typeof getTemplates>
    ) {
        const list = await getTemplates(...args)
        return Object.fromEntries(
            list.map((template) => [template.id, template])
        )
    }

    export function getTemplatesHash() {
        return fetchText(url("templates/hash"))
    }

    export function getHashList() {
        return fetchJSON<string[]>(url("templates/list/hash"))
    }

    export function getNewList() {
        return fetchJSON<string[]>(url("templates/list/new"))
    }

    export function getTopList() {
        return fetchJSON<string[]>(url("templates/list/top"))
    }

    export function getHotList() {
        return fetchJSON<string[]>(url("templates/list/hot"))
    }

    export async function registerUse(template: API.Template) {
        await fetch(url(`templates/${template.id}/register-use`), {
            method: "POST"
        })
    }

    export function getPreviewURL(template: API.Template) {
        return url(`storage/${template.previewFile}`)
    }
}
