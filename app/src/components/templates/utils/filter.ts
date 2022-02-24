import { TemplateMeta } from "@meme-bros/client-lib"
import { useMemo } from "react"

export function useFilteredTemplates({ templates, search }: {
    templates: TemplateMeta[],
    search: string
}) {
    return useMemo(() => {
        return templates.filter((template) =>
            template.name
                .toLowerCase()
                .includes(search.toLowerCase())
        )
    }, [search, templates])
}
