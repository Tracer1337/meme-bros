import { Editor } from "@meme-bros/shared"

export type TemplatesFile = {
    list: string[],
    meta: Record<string, TemplateMeta>
}

export type TemplateMeta = {
    id: string,
    name: string,
    previewFile: string,
    templateFile: string
}

export type TemplateCanvas = Editor.Canvas
