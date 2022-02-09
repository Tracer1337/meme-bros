import { Modules } from "@meme-bros/client-lib"

const canvasModule: Modules.CanvasModule = {
    uri: __DEV__
        ? "http://10.0.2.2:3000"
        : "file:///android_asset/canvas/build/index.html"
}

export default canvasModule
