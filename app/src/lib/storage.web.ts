import { ImageResolvedAssetSource } from "react-native"
import type { Asset, CameraOptions } from "react-native-image-picker"

function importFile(mimeType: string) {
    return new Promise<File | undefined>((resolve) => {
        const input = document.createElement("input")
        input.onchange = (event: Event) => {
            const file = (event.target as HTMLInputElement)?.files?.[0]
            resolve(file)
        }
        input.type = "file"
        input.accept = mimeType
        document.body.appendChild(input)
        input.click()
        input.remove()
    })
}

function downloadFile(src: string, filename: string) {
    const a = document.createElement("a")
    a.href = src
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
}

export namespace Gallery {
    export async function importImage(
        options?: Partial<CameraOptions>
    ): Promise<Asset | null> {
        return new Promise(async (resolve) => {
            const file = await importFile("image/*")
            if (!file) {
                return null
            }
            const url = URL.createObjectURL(file)
            const image = await resolveAssetSource(url)
            URL.revokeObjectURL(url)
            const reader = new FileReader()
            reader.onload = () => resolve(!reader.result ? null : {
                base64: reader.result as string,
                width: image.width,
                height: image.height
            })
            reader.readAsDataURL(file)
        })
    }

    export async function saveImage(base64: string) {
        const filename = base64.startsWith("data:image/gif")
            ? "download.gif"
            : "download.png"
        downloadFile(base64, filename)
    }
}

export function resolveAssetSource(uri: string) {
    return new Promise<ImageResolvedAssetSource>((resolve) => {
        const image = new Image()
        image.onload = () => {
            resolve({
                width: image.naturalWidth,
                height: image.naturalHeight,
                scale: 1,
                uri
            })
        }
        image.src = uri
    })
}
