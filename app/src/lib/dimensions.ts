import { Dimensions as RNDimensions, Platform } from "react-native"

const getWebDimensions = (): ReturnType<
    typeof RNDimensions["get"]
> => {
    const element = document.getElementById("app")
    const rect = element
        ? element.getBoundingClientRect()
        : { width: 0, height: 0 }
    return {
        width: rect.width,
        height: rect.height,
        scale: 1,
        fontScale: 1
    }
}

export const Dimensions: { get: typeof RNDimensions["get"] } =
    Platform.select({
        web: { get: getWebDimensions },
        default: { get: RNDimensions.get }
    })
