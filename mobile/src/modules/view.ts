import { Modules } from "@meme-bros/client-lib"
import { useWindowDimensions } from "react-native"

export function useViewModule(): Modules.ViewModule {
    return {
        useDimensions: useWindowDimensions
    }
}
