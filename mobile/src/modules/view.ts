import { Modules } from "@meme-bros/client-lib"
import { useWindowDimensions } from "react-native"

const viewModule: Modules.ViewModule = {
    useDimensions: useWindowDimensions
}

export default viewModule
