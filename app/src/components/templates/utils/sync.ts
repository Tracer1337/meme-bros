import { useEffect } from "react"
import { setupTemplatesStorage } from "./setup"
import { Documents } from "./storage"
import { API } from "../../../lib/api"
import { TemplateMeta, TemplatesFile } from "../types"

async function syncTemplates() {
    const templatesFile = await Documents.readTemplatesFile()
    const hash = await API.getTemplatesListHash()

    if (templatesFile.hash === hash) {
        return
    }

    const newList = await API.getTemplatesList()
    const templatesDiff = diffUnique(templatesFile.list, newList)

    const promises = []

    if (templatesDiff.added.length > 0) {
        const templates = await API.getTemplatesAsMap(templatesDiff.added)
        promises.push(...templatesDiff.added.map((hash) =>
            addTemplate(templatesFile, templates[hash])
        ))
    }

    if (templatesDiff.removed.length > 0) {
        promises.push(...templatesDiff.removed.map((hash) =>
            removeTemplate(templatesFile, templatesFile.meta[hash])
        ))
    }

    await Promise.all(promises)

    templatesFile.hash = hash
    templatesFile.list = newList
    await Documents.writeTemplatesFile(templatesFile)
}

async function addTemplate(
    templatesFile: TemplatesFile,
    template: API.Template
) {
    const [templateFile, previewFile] = await Promise.all([
        Documents.writeTemplate(template),
        Documents.downloadPreview(template)
    ])
    templatesFile.meta[template.hash] = {
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
    delete templatesFile.meta[template.hash]
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
    useEffect(() => {
        setupTemplatesStorage()
            .then(syncTemplates)
    }, [])
}
