import { useEffect } from "react"
import { AnyFunction } from "tsdef"
import { useNetInfo } from "@react-native-community/netinfo"
import { TemplateMeta, TemplatesFile } from "@meme-bros/client-lib"
import * as API from "@meme-bros/api-sdk"
import { setupTemplatesStorage } from "./setup"
import { Documents } from "./storage"
import { useAppContext } from "../../../lib/context"

const { api } = API

async function syncTemplates({ onBegin, onDone }: {
    onBegin: AnyFunction,
    onDone: AnyFunction
}) {
    const templatesFile = await Documents.readTemplatesFile()
    const hash = await api.templates.hash.get()

    if (templatesFile.hash === hash) {
        onDone()
        return
    }

    onBegin()

    const [hashList, newList, topList, hotList] = await Promise.all([
        api.templates.hashList.get(),
        api.templates.newList.get(),
        api.templates.topList.get(),
        api.templates.hotList.get()
    ])

    const templatesDiff = diffUnique(templatesFile.hashList, hashList)

    const promises = []

    if (templatesDiff.added.length > 0) {
        const templates = await api.templates.map.get(templatesDiff.added)
        const ids = createIdsMap(templates)
        promises.push(...templatesDiff.added.map(async (hash) => {
            try {
                await addTemplate(templatesFile, templates[ids[hash]])
            } catch (error) {
                console.error("Could not add template", error)
            }
        }))
    }

    if (templatesDiff.removed.length > 0) {
        const ids = createIdsMap(templatesFile.meta)
        promises.push(...templatesDiff.removed.map(async (hash) => {
            try {
                await removeTemplate(templatesFile, templatesFile.meta[ids[hash]])
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
    await Documents.writeTemplatesFile(templatesFile)
    
    onDone()
}

async function addTemplate(
    templatesFile: TemplatesFile,
    template: API.Template
) {
    const [canvasFile] = await Promise.all([
        Documents.downloadCanvas(template),
        Documents.downloadPreview(template)
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
    templatesFile: TemplatesFile,
    template: TemplateMeta
) {
    delete templatesFile.meta[template.id]
    await Promise.all([
        Documents.removeCanvas(template),
        Documents.removePreview(template)
    ])
}

function diffUnique<T>(a: T[], b: T[]) {
    const diff = {
        added: [] as T[],
        removed: [] as T[]
    }

    const setA = new Set(a)
    const setB = new Set(b)

    setA.forEach((value) => {
        if (!setB.has(value)) {
            diff.removed.push(value)
        }
    })

    setB.forEach((value) => {
        if (!setA.has(value)) {
            diff.added.push(value)
        }
    })

    return diff
}

function createIdsMap(templates: Record<string, { hash: string }>) {
    return Object.fromEntries(
        Object.entries(templates).map(([id, meta]) => [meta.hash, id])
    )
}

export function useTemplatesSync() {
    const appContext = useAppContext()

    const netInfo = useNetInfo()

    useEffect(() => {
        if (!netInfo.isConnected) {
            return
        }
        setupTemplatesStorage()
            .then(() => syncTemplates({
                onBegin: () => appContext.set({
                    templates: {
                        isSyncing: true,
                        error: false
                    }
                }),
                onDone: () => appContext.set({
                    templates: {
                        isSyncing: false,
                        error: false
                    }
                })
            }))
            .catch((error) => {
                console.error(error)
                appContext.set({
                    templates: {
                        isSyncing: false,
                        error: true
                    }
                })
            })
    }, [netInfo.isConnected])
}
