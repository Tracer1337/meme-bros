import produce from "immer"
import * as API from "@meme-bros/api-sdk/dist/admin"
import { Editor } from "@meme-bros/shared"

export function scaleCanvas(canvas: Editor.Canvas): API.CreateTemplate["canvas"] {
    return produce(canvas, (draft) => {
        // @ts-ignore
        delete draft.pixelRatio

        const width = draft.width

        draft.width = draft.width / width
        draft.height = draft.height / width
    
        if (draft.base?.rect) {
            scaleRect(draft.base, "rect", width)
        }
    
        draft.layers.forEach((id) => {
            scaleRect(draft.elements[id], "rect", width)
        })    
    })
}

function scaleRect(obj: any, key: string, width: number) {
    obj[key] = {
        ...obj[key],
        x: obj[key].x / width,
        y: obj[key].y / width,
        width: obj[key].width / width,
        height: obj[key].height / width
    }
}
