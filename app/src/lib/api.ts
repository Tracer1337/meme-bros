import type { Editor } from "@meme-bros/shared"

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
            list.map((template) => [template.hash, template])
        )
    }

    export function getTemplatesList() {
        return fetchJSON<string[]>(url("templates/list"))
    }

    export function getTemplatesListHash() {
        return fetchText(url("templates/list/hash"))
    }

    export function getPreviewURL(template: API.Template) {
        return url(`storage/${template.previewFile}`)
    }
}
