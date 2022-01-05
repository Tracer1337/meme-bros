import { NativeModules } from "react-native"
import * as Core from "@meme-bros/core"

const { CoreModule } = NativeModules

export default {
    render: (data) => CoreModule.render(JSON.stringify(data)),
    textfit: (...args) => CoreModule.textfit(...args)
} as {
    render(canvas: Core.Canvas): Promise<string>,
    textfit: (...args: [text: string, fontFamily: string, fontWeight: string, width: number, height: number]) => Promise<number>
}
