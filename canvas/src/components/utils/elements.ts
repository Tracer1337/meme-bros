import { getDefaultDataByType, makeId } from "@meme-bros/client-lib"
import { Editor } from "@meme-bros/shared"
import { getImageDimensions } from "../../lib/image"

export async function createCanvasElement<
    T extends Editor.CanvasElement["type"]
>(type: T) {
    const newElement: Editor.PickElement<T> = {
        id: makeId(),
        type,
        rect: {
            x: 0,
            y: 0,
            width: 200,
            height: 100,
            rotation: 0
        },
        data: getDefaultDataByType(type)
    } as any
    if (type === "image") {
        const data = newElement.data as Editor.PickElement<"image">["data"]
        const { width, height } = await getImageDimensions(data.uri)
        data.naturalWidth = width
        data.naturalHeight = height
    }
    return newElement
}
