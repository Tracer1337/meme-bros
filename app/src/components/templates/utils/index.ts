import { useEffect, useMemo, useState } from "react"
import { Platform } from "react-native"
import { TemplateMeta, TemplatesFile } from "@meme-bros/client-lib"
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

export function useTemplates(): {
    templates: {
        new: TemplateMeta[],
        top: TemplateMeta[],
        hot: TemplateMeta[]
    },
    isLoading: boolean
} {
    const [templatesFile, setTemplatesFile] = useState<
        TemplatesFile | undefined
    >()

    const templates = useMemo(() => {
        if (!templatesFile) {
            return {
                new: [],
                top: [],
                hot: []
            }
        }

        const pickTemplates = (ids: string[]) =>
            ids.map((id) => templatesFile.meta[id])
    
        return {
            new: pickTemplates(templatesFile.newList),
            top: pickTemplates(templatesFile.topList),
            hot: pickTemplates(templatesFile.hotList)
        }
    }, [templatesFile])

    useEffect(() => {
        Documents.readTemplatesFile()
            .then(setTemplatesFile)
            .catch(console.error)
    }, [])

    return {
        templates,
        isLoading: !templatesFile
    }
}
