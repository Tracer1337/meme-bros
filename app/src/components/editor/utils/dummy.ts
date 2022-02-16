import { useModule } from "@meme-bros/client-lib"
import {
    Editor,
    replaceMimeTypeInDataURI,
    fetchAsDataURI
} from "@meme-bros/shared"
import { useCanvasScaling } from "./scale"

export function useCanvasDummyLoader() {
    const storage = useModule("storage")
    const { scaleToScreen } = useCanvasScaling()

    return async (): Promise<Editor.Canvas | null> => {
        const uri = require("../../../assets/meme1.png")
        const image = await storage.resolveAssetSource(uri.default || uri)
        if (!image) {
            throw new Error("Could not resolve dummy image")
        }
        const dataURI = await fetchAsDataURI(image.uri)
        const base64 = replaceMimeTypeInDataURI(dataURI, "image/png")
        const rect = scaleToScreen(image)
        return {
            ...rect,
            pixelRatio: 1,
            debug: false,
            mode: Editor.CanvasMode.CLASSIC,
            base: {
                id: 0,
                rounded: false,
                padding: false
            },
            backgroundColor: "#ffffff",
            elements: {
                0: {
                    id: 0,
                    type: "image",
                    rect: {
                        ...rect,
                        x: 0,
                        y: 0,
                        rotation: 0
                    },
                    data: {
                        uri: base64,
                        animated: false,
                        loop: true,
                        borderRadius: 0,
                        keepAspectRatio: true,
                        naturalWidth: 0,
                        naturalHeight: 0
                    }
                },
                1: {
                    id: 1,
                    type: "textbox",
                    rect: {
                        x: 50,
                        y: 50,
                        width: 200,
                        height: 100,
                        rotation: 0
                    },
                    data: {
                        text: "This is my text",
                        outlineWidth: 5,
                        outlineColor: "#ffffff",
                        backgroundColor: "#2ecc71",
                        fontFamily: "Impact",
                        fontWeight: "normal",
                        textAlign: "left",
                        verticalAlign: "center",
                        color: "#000000",
                        caps: true,
                        padding: 8
                    }
                },
                2: {
                    id: 2,
                    type: "image",
                    rect: {
                        x: 200,
                        y: 200,
                        width: 200,
                        height: 200,
                        rotation: 0
                    },
                    data: {
                        uri: base64,
                        animated: false,
                        loop: true,
                        borderRadius: 0,
                        keepAspectRatio: true,
                        naturalWidth: 0,
                        naturalHeight: 0
                    }
                }
            },
            layers: [0, 1, 2]
        }
    }
}
