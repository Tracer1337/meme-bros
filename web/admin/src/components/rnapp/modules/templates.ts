import { Modules } from "@meme-bros/client-lib"
import { api } from "@meme-bros/api-sdk"

const loadTemplates: Modules.TemplatesModule["loadTemplates"] = async () => {
    const [templates, newList, topList, hotList] = await Promise.all([
        api.templates.all.get(),
        api.templates.newList.get(),
        api.templates.topList.get(),
        api.templates.hotList.get()
    ])
    const meta = Object.fromEntries(
        templates.map((template) => [template.id, template])
    )
    return {
        meta,
        newList,
        topList,
        hotList
    } as any
}

const templatesModule: Modules.TemplatesModule = {
    loadTemplates,
    getPreviewURI: api.storage.templatePreview.url,
    getCanvas: api.templates.canvas.get
}

export default templatesModule
