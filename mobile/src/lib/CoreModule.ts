import { NativeModules } from "react-native"

const { CoreModule } = NativeModules

export default {
    render: (data) => CoreModule.render(JSON.stringify(data)),
    textfit: (...args) => CoreModule.textfit(...args)
} as {
    render(json: any): Promise<string>,
    textfit: (...args: [text: string, fontFamily: string, fontWeight: string, width: number, height: number]) => Promise<number>
}
