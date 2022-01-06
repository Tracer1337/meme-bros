import { ImageResolvedAssetSource } from "react-native"
import type { Asset, CameraOptions } from "react-native-image-picker"

export async function importImage(
    options?: Partial<CameraOptions>
): Promise<Asset | null> {
    return null
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
