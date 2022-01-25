import { useEffect } from "react"
import { AnyFunction } from "tsdef"
import { useNetInfo } from "@react-native-community/netinfo"
import { setupTemplatesStorage } from "./setup"
import { Documents } from "./storage"
import { API } from "../../../lib/api"
import { TemplateMeta, TemplatesFile } from "../types"
import { useAppContext } from "../../../lib/context"

async function syncTemplates({ onBegin, onDone }: {
    onBegin: AnyFunction,
    onDone: AnyFunction
}) {
    const templatesFile = await Documents.readTemplatesFile()
    const hash = await API.getTemplatesHash()

    if (templatesFile.hash === hash) {
        onDone()
        return
    }

    onBegin()

    const [hashList, newList, topList, hotList] = await Promise.all([
        API.getHashList(),
        API.getNewList(),
        API.getTopList(),
        API.getHotList()
    ])

    const templatesDiff = diffUnique(templatesFile.hashList, hashList)

    const promises = []

    if (templatesDiff.added.length > 0) {
        const templates = await API.getTemplatesAsMap(templatesDiff.added)
        promises.push(...templatesDiff.added.map(async (hash) => {
            try {
                await addTemplate(templatesFile, templates[hash])
            } catch (error) {
                console.error("Could not add template", error)
            }
        }))
    }

    if (templatesDiff.removed.length > 0) {
        promises.push(...templatesDiff.removed.map(async (hash) => {
            try {
                await removeTemplate(templatesFile, templatesFile.meta[hash])
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
    const [templateFile, previewFile] = await Promise.all([
        Documents.writeTemplate(template),
        Documents.downloadPreview(template)
    ])
    templatesFile.meta[template.id] = {
        name: template.name,
        hash: template.hash,
        id: template.id,
        previewFile,
        templateFile
    }
}

async function removeTemplate(
    templatesFile: TemplatesFile,
    template: TemplateMeta
) {
    delete templatesFile.meta[template.id]
    await Promise.all([
        Documents.removeTemplate(template),
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
