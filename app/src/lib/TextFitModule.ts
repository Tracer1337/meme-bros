import { NativeModules } from "react-native"

const { TextFitModule } = NativeModules

export default TextFitModule as {
    fitText(options: {
        text: string,
        fontFamily: string,
        fontWeight: "normal" | "bold",
        containerRect: {
            width: number,
            height: number
        }
    }): Promise<number>
}
