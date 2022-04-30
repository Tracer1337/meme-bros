import { Modules } from "@meme-bros/client-lib"
import { Resources } from "../lib/resources"

export function useTemplatesModule(): Modules.TemplatesModule {
    const loadTemplates: Modules.TemplatesModule["loadTemplates"] = async () => {
        const templatesFile = await Resources.readTemplatesFile()
    
        const pickTemplates = (ids: string[]) =>
            ids.map((id) => templatesFile.meta[id])
    
        return {
            new: pickTemplates(templatesFile.newList),
            top: pickTemplates(templatesFile.topList),
            hot: pickTemplates(templatesFile.hotList)
        }
    }

    return {
        loadTemplates,
        getPreviewURI: Resources.getPreviewURI,
        getCanvas: Resources.readCanvas
    }
}
