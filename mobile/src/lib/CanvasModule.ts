import { NativeModules } from "react-native"
import { ContextValue } from "../components/editor/Context"

const { CanvasModule } = NativeModules

export default {
    generate: (data) => CanvasModule.generate(JSON.stringify(data))
} as {
    generate(json: ContextValue["canvas"]): Promise<string>
}
