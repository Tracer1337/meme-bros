import { useEffect } from "react"
import { diff } from "fast-array-diff"
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
    const templatesDiff = diff(templatesFile.list, newList)
    const templates = await API.getTemplatesAsMap()
    await Promise.all([
        ...templatesDiff.added.map((hash) =>
            addTemplate(templatesFile, templates[hash])
        ),
        ...templatesDiff.removed.map((hash) =>
            removeTemplate(templatesFile, templatesFile.meta[hash])
        )
    ])
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

export function useTemplatesSync() {
    useEffect(() => {
        setupTemplatesStorage()
            .then(syncTemplates)
    }, [])
}
