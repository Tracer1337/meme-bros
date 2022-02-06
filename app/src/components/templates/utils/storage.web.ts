import { TemplatesFile } from "@meme-bros/client-lib"
import * as API from "@meme-bros/api-sdk"

const { api } = API

export namespace Documents {
    export async function readTemplatesFile(): Promise<TemplatesFile> {
        const [templates, newList, topList, hotList] = await Promise.all([
            api.templates.all.get(),
            api.templates.newList.get(),
            api.templates.topList.get(),
            api.templates.hotList.get()
        ])
        const meta = Object.fromEntries(
            templates.map((template) => [template.id, template])
        )
        return {
            meta,
            newList,
            topList,
            hotList
        } as any
    }

    export function readCanvas(template: API.Template) {
        return api.templates.canvas.get(template)
    }
}
