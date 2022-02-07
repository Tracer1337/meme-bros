import { Image } from "react-native"
import { Asset, CameraOptions, launchImageLibrary } from "react-native-image-picker"
import * as RNFS from "react-native-fs"

export function join(...paths: string[]) {
    return paths.join("/")
}

// Workaround for https://github.com/itinance/react-native-fs/pull/837
export async function writeFilePatched(path: string, data: string) {
    await RNFS.unlink(path)
    await RNFS.writeFile(path, data)
}

export namespace Gallery {
    export async function importImage(
        options?: Partial<CameraOptions>
    ): Promise<Asset | null> {
        const res = await launchImageLibrary({
            mediaType: "photo",
            includeBase64: true,
            maxWidth: 500,
            maxHeight: 500,
            quality: 1,
            ...options
        })
        if (res.didCancel || res.errorCode) {
            return null
        }
        const image = res.assets?.[0]
        if (!image) {
            return null
        }
        return {
            ...image,
            base64: `data:${image.type};base64,${image.base64}`
        }
    }

    export async function saveImage(base64: string) {
        const filename = `MemeBros-${getDateString()}-${makeId(8)}`
        const albumPath = join(RNFS.DocumentDirectoryPath, "Pictures", "Memes")
        await RNFS.mkdir(albumPath)
        await RNFS.writeFile(join(albumPath, filename), base64, "base64")
    }
}

export function resolveAssetSource(id: number) {
    return Promise.resolve(Image.resolveAssetSource(id))
}

export function makeId(length: number) {
    var result = '';
    var characters = '0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export function getDateString() {
    const today = new Date()
    const dd = String(today.getDate()).padStart(2, "0")
    const mm = String(today.getMonth() + 1).padStart(2, "0")
    const yyyy = today.getFullYear()

    return dd + mm + yyyy
}
