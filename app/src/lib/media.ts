import { Image } from "react-native"
import { Asset, CameraOptions, launchImageLibrary } from "react-native-image-picker"

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

export const resolveAssetSource = (uri: string) =>
    Promise.resolve(Image.resolveAssetSource({ uri }))
