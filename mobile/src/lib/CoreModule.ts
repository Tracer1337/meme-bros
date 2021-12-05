import { NativeModules } from "react-native"
import { ContextValue } from "../components/editor/Context"

const { CoreModule } = NativeModules

export default {
    generate: (data) => CoreModule.generate(JSON.stringify(data)),
    textfit: (...args) => CoreModule.textfit(...args)
} as {
    generate(json: ContextValue["canvas"]): Promise<string>,
    textfit: (...args: [text: string, fontFamily: string, fontWeight: string, width: number, height: number]) => Promise<number>
}
