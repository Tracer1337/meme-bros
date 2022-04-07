import { usePublicAPI } from "@meme-bros/api-sdk"
import { Modules } from "@meme-bros/client-lib"

export function useTemplatesModule(): Modules.TemplatesModule {
    const api = usePublicAPI()

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
        getPreviewURI: (template) => api.storage.templatePreview.url(template),
        getCanvas: (template) => api.templates.canvas.get(template)
    }
}
