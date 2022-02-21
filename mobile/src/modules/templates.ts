import { Modules } from "@meme-bros/client-lib"
import { Documents } from "../lib/documents"

const loadTemplates: Modules.TemplatesModule["loadTemplates"] = async () => {
    const templatesFile = await Documents.readTemplatesFile()

    const pickTemplates = (ids: string[]) =>
        ids.map((id) => templatesFile.meta[id])

    return {
        new: pickTemplates(templatesFile.newList),
        top: pickTemplates(templatesFile.topList),
        hot: pickTemplates(templatesFile.hotList)
    }
}

const templatesModule: Modules.TemplatesModule = {
    loadTemplates,
    getPreviewURI: Documents.getPreviewURI,
    getCanvas: Documents.readCanvas
}

export default templatesModule
