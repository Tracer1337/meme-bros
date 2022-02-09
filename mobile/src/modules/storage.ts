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

const saveImage: Modules.StorageModule["saveImage"] = async (base64) => {
    const filename = `MemeBros-${getDateString()}-${makeId()}`
    const albumPath = join(RNFS.DocumentDirectoryPath, "Pictures", "Memes")
    await RNFS.mkdir(albumPath)
    await RNFS.writeFile(join(albumPath, filename), base64, "base64")
}

const resolveAssetSource: Modules.StorageModule["resolveAssetSource"] = (id) => {
    if (typeof id !== "number") {
        return Promise.resolve(undefined)
    }
    return Promise.resolve(Image.resolveAssetSource(id))
}

export const storageModule: Modules.StorageModule = {
    importImage,
    saveImage,
    resolveAssetSource
}
