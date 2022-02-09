import { NativeModules } from "react-native"
import { Modules } from "@meme-bros/client-lib"

const coreModule: Modules.CoreModule = {
    render(canvas) {
        return NativeModules.CoreModule.render(
            JSON.stringify(canvas)
        )
    }
}

export default coreModule
