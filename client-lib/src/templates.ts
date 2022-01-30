import { API } from "./api"

export type TemplatesFile = {
    hash: string,
    hashList: string[],
    newList: string[],
    topList: string[],
    hotList: string[],
    meta: Record<string, TemplateMeta>
}

export type TemplateMeta = API.Template & {
    canvasFile: string
}
