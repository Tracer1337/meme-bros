import { useEffect, useMemo, useState } from "react"
import RNFS from "react-native-fs"
import { TemplateMeta, TemplatesFile } from "../types"
import { PREVIEWS_DIR } from "./constants"
import { Documents, join } from "./storage"

export function getPreviewURI(template: TemplateMeta) {
    return "file://" + join(
        RNFS.DocumentDirectoryPath,
        PREVIEWS_DIR,
        template.previewFile
    )
}

export function useTemplates(): {
    new: TemplateMeta[],
    top: TemplateMeta[],
    hot: TemplateMeta[]
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
            .catch((error) => console.error(error))
    }, [])

    return templates
}
