import { getDateString, join, makeId, Modules } from "@meme-bros/client-lib"
import { Image } from "react-native"
import { launchImageLibrary } from "react-native-image-picker"
import * as RNFS from "react-native-fs"

const importImage: Modules.StorageModule["importImage"] = async () => {
    const res = await launchImageLibrary({
        mediaType: "photo",
        includeBase64: true,
        maxWidth: 500,
        maxHeight: 500,
        quality: 1
    })
    const image = res.assets?.[0]
    if (res.didCancel || res.errorCode || !image) {
        return
    }
    return {
        width: image.width || 0,
        height: image.height || 0,
        base64: `data:${image.type};base64,${image.base64}`
    }
}

const saveImage: Modules.StorageModule["saveImage"] = async (dataURI) => {
    const ext = dataURI.startsWith("data:image/gif") ? "gif" : "png"
    const filename = `MemeBros-${getDateString()}-${makeId()}.${ext}`
    const albumPath = join(RNFS.ExternalStorageDirectoryPath, "Pictures", "Memes")
    const base64 = dataURI.split(",")[1]
    await RNFS.mkdir(albumPath)
    await RNFS.writeFile(join(albumPath, filename), base64, "base64")
}

const resolveAssetSource: Modules.StorageModule["resolveAssetSource"] = (id) => {
    if (typeof id !== "number") {
        return Promise.resolve(undefined)
    }
    return Promise.resolve(Image.resolveAssetSource(id))
}

const storageModule: Modules.StorageModule = {
    importImage,
    saveImage,
    resolveAssetSource
}

export default storageModule
