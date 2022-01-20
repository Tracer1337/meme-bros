import { useEffect, useState } from "react"
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

export function useTemplates(): TemplateMeta[] {
    const [templatesFile, setTemplatesFile] = useState<
        TemplatesFile | undefined
    >()

    useEffect(() => {
        Documents.readTemplatesFile()
            .then(setTemplatesFile)
            .catch((error) => console.error(error))
    }, [])

    return !templatesFile
        ? []
        : templatesFile.list.map((id) => templatesFile.meta[id])
}
