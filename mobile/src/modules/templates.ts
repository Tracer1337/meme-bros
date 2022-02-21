import { Modules } from "@meme-bros/client-lib"
import { Resources } from "../lib/resources"

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

const templatesModule: Modules.TemplatesModule = {
    loadTemplates,
    getPreviewURI: Resources.getPreviewURI,
    getCanvas: Resources.readCanvas
}

export default templatesModule
