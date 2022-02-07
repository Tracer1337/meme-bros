import { Platform } from "react-native"
import { TemplateMeta } from "@meme-bros/client-lib"
import { api } from "@meme-bros/api-sdk"
import { PREVIEWS_DIR } from "./constants"
import { Documents, join } from "./storage"

export const getPreviewURI = Platform.select({
    android: (template: TemplateMeta) => {
        const RNFS = require("react-native-fs")
        return "file://" + join(
            RNFS.DocumentDirectoryPath,
            PREVIEWS_DIR,
            template.previewFile
        )
    },
    default: api.storage.templatePreview.url
})

export async function loadTemplateLists() {
    const templatesFile = await Documents.readTemplatesFile()

    const pickTemplates = (ids: string[]) =>
        ids.map((id) => templatesFile.meta[id])

    return {
        new: pickTemplates(templatesFile.newList),
        top: pickTemplates(templatesFile.topList),
        hot: pickTemplates(templatesFile.hotList)
    }
}
