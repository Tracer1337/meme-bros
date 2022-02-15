import { getMimeTypeFromDataURI } from "@meme-bros/shared"
import { Modules } from "@meme-bros/client-lib"

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

const importImage: Modules.StorageModule["importImage"] = () => {
    return new Promise(async (resolve) => {
        const file = await importFile("image/*")
        if (!file) {
            return
        }
        const url = URL.createObjectURL(file)
        const image = await resolveAssetSource(url)
        URL.revokeObjectURL(url)
        if (!image) {
            return
        }
        const reader = new FileReader()
        reader.onload = () => resolve(!reader.result ? undefined : {
            base64: reader.result as string,
            width: image.width,
            height: image.height
        })
        reader.readAsDataURL(file)
    })
}

const saveImage: Modules.StorageModule["saveImage"] = async (dataURI) => {
    const filename = getMimeTypeFromDataURI(dataURI) === "image/gif"
        ? "download.gif"
        : "download.png"
    downloadFile(dataURI, filename)
}

const resolveAssetSource: Modules.StorageModule["resolveAssetSource"] = (uri) => {
    if (typeof uri !== "string") {
        return Promise.resolve(undefined)
    }
    return new Promise((resolve) => {
        const image = new Image()
        image.onload = () => {
            resolve({
                uri,
                width: image.naturalWidth,
                height: image.naturalHeight
            })
        }
        image.src = uri
    })
}

const storageModule: Modules.StorageModule = {
    importImage,
    saveImage,
    resolveAssetSource
}

export default storageModule
