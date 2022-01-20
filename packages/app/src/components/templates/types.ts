import { API } from "../../lib/api"

export type TemplatesFile = {
    list: string[],
    hash: string,
    meta: Record<string, TemplateMeta>
}

export type TemplateMeta = Omit<API.Template, "canvas"> & {
    templateFile: string
}

export type TemplateCanvas = API.Template["canvas"]
