import { NativeModules } from "react-native"
import { Modules } from "@meme-bros/client-lib"

export function useCoreModule(): Modules.CoreModule {
    return {
        render: (canvas) => NativeModules.CoreModule.render(
            JSON.stringify(canvas)
        )
    }
}
