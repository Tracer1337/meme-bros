import { useAPI } from "@meme-bros/api-sdk"
import { Modules } from "@meme-bros/client-lib"

export function useTemplatesModule(): Modules.TemplatesModule {
    const api = useAPI()

    const loadTemplates: Modules.TemplatesModule["loadTemplates"] = async () => {
        const [templates, newList, topList, hotList] = await Promise.all([
            api.templates.getAll(),
            api.templates.getNewList(),
            api.templates.getTopList(),
            api.templates.getHotList()
        ])
    
        const meta = Object.fromEntries(
            templates.map((template) => [template.id, template])
        )
    
        const pickTemplates = (ids: string[]) =>
            ids.map((id) => meta[id])
    
        return {
            new: pickTemplates(newList),
            top: pickTemplates(topList),
            hot: pickTemplates(hotList)
        } as any
    }
    
    return {
        loadTemplates,
        getPreviewURI: (template) => api.storage.url(template.previewFile),
        getCanvas: (template) => api.templates.getCanvas(template.id)
    }
}
