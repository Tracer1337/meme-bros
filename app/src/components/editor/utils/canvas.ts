import { Editor, makeId, getDefaultDataByType } from "@meme-bros/client-lib"
import { importImage } from "../../../lib/media"

export async function createCanvasElement<
    T extends Editor.CanvasElement["type"]
>(type: T): Promise<Editor.PickElement<T> | undefined> {
    const newElement: Editor.PickElement<T> = {
        id: makeId(),
        type,
        interactive: true,
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
        const image = await importImage()
        if (!image || !image.base64) {
            return
        }
        const element = newElement as Editor.PickElement<"image">
        element.data = {
            ...element.data,
            uri: image.base64,
            animated: image.base64.startsWith("data:image/gif")
        }
        if (image.width && image.height) {
            element.rect.width = element.data.naturalWidth = image.width
            element.rect.height = element.data.naturalHeight = image.height
        }
    }

    return newElement
}
