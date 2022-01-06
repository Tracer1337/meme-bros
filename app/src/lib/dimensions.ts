import { Dimensions as RNDimensions, Platform } from "react-native"

const getWebDimensions = (): ReturnType<
    typeof RNDimensions["get"]
> => ({
    width: 400,
    height: 700,
    scale: 1,
    fontScale: 1
})

export const Dimensions: { get: typeof RNDimensions["get"] } =
    Platform.select({
        web: { get: getWebDimensions },
        default: { get: RNDimensions.get }
    })
