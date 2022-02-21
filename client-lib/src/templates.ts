import * as API from "@meme-bros/api-sdk"
import type { SyncConfig } from "./sync"
import { join, assertDirExists, diffUnique, createIdsMap } from "./utils"

export const PREVIEWS_DIR = "previews"
export const CANVAS_DIR = "canvas"
export const TEMPLATES_FILE = "templates.json"

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

const emptyTemplatesFile: TemplatesFile = {
    hash: "",
    hashList: [],
    newList: [],
    topList: [],
    hotList: [],
    meta: {}
}

export async function syncTemplates(config: SyncConfig) {
    const { path, fs, api } = config

    const templatesFile: TemplatesFile = JSON.parse(
        await fs.readFile(join(path, TEMPLATES_FILE))
    ) || emptyTemplatesFile
    const hash = await api.templates.hash.get()

    if (templatesFile.hash === hash) {
        return
    }

    await Promise.all([
        assertDirExists(config, CANVAS_DIR),
        assertDirExists(config, PREVIEWS_DIR)
    ])

    const [hashList, newList, topList, hotList] = await Promise.all([
        api.templates.hashList.get(),
        api.templates.newList.get(),
        api.templates.topList.get(),
        api.templates.hotList.get()
    ])

    const templatesDiff = diffUnique(templatesFile.hashList, hashList)

    const promises = []

    if (templatesDiff.added.length > 0) {
        const templates = await api.templates.map.get({
            hashes: templatesDiff.added
        })
        const ids = createIdsMap(templates)
        promises.push(...templatesDiff.added.map(async (hash) => {
            try {
                await addTemplate(
                    config,
                    templatesFile,
                    templates[ids[hash]]
                )
            } catch (error) {
                console.error("Could not add template", error)
            }
        }))
    }

    if (templatesDiff.removed.length > 0) {
        const ids = createIdsMap(templatesFile.meta)
        promises.push(...templatesDiff.removed.map(async (hash) => {
            try {
                await removeTemplate(
                    config,
                    templatesFile,
                    templatesFile.meta[ids[hash]]
                )
            } catch (error) {
                console.error("Could not remove template", error)
            }
        }))
    }

    await Promise.all(promises)

    templatesFile.hash = hash
    templatesFile.hashList = hashList
    templatesFile.newList = newList
    templatesFile.topList = topList
    templatesFile.hotList = hotList

    await fs.writeFile(
        join(path, TEMPLATES_FILE),
        JSON.stringify(templatesFile, null, 4)
    )
}

async function addTemplate(
    { path, download, api }: SyncConfig,
    templatesFile: TemplatesFile,
    template: API.Template
) {
    const canvasFile = `${template.hash}.json`
    await Promise.all([
        download(
            api.templates.canvas.url(template),
            join(path, CANVAS_DIR, canvasFile)
        ),
        download(
            api.storage.templatePreview.url(template),
            join(path, PREVIEWS_DIR, template.previewFile)
        )
    ])
    templatesFile.meta[template.id] = {
        name: template.name,
        hash: template.hash,
        id: template.id,
        previewFile: template.previewFile,
        canvasFile
    }
}

async function removeTemplate(
    { path, fs }: SyncConfig,
    templatesFile: TemplatesFile,
    template: TemplateMeta
) {
    delete templatesFile.meta[template.id]
    await Promise.all([
        fs.rm(join(path, CANVAS_DIR, `${template.hash}.json`)),
        fs.rm(join(path, PREVIEWS_DIR, template.previewFile))
    ])
}
