import { getMimeTypeFromDataURI } from "@meme-bros/shared"
import { Modules } from "@meme-bros/client-lib"
import { downloadFile, importImage, getImageDimensions } from "../lib/file"

export function useStorageModule(): Modules.StorageModule {
    const saveImage: Modules.StorageModule["saveImage"] = async (dataURI) => {
        const filename = getMimeTypeFromDataURI(dataURI) === "image/gif"
            ? "download.gif"
            : "download.png"
        downloadFile(dataURI, filename)
    }
    
    const resolveAssetSource: Modules.StorageModule["resolveAssetSource"] = async (uri) => {
        if (typeof uri !== "string") {
            return undefined
        }
        const dim = await getImageDimensions(uri)
        return { uri, ...dim }
    }

    return {
        importImage,
        saveImage,
        resolveAssetSource,
        getImageSize: getImageDimensions
    }
}
