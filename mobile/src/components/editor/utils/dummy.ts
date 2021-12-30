import { Image } from "react-native"
import { Editor } from "@meme-bros/shared"
import { fetchBase64 } from "../../../lib/base64"
import { scaleToScreen } from "./canvas"

function binaryToPNG(base64: string) {
    return base64.replace("application/octet-stream", "image/png")
}

export async function loadCanvasDummy(): Promise<Editor.Canvas> {
    const image = Image.resolveAssetSource(require("../../../assets/meme.png"))
    const base64 = binaryToPNG(await fetchBase64(image.uri))
    const rect = scaleToScreen(image)
    return {
        ...rect,
        pixelRatio: 1,
        debug: false,
        backgroundColor: "#ffffff",
        elements: [
            {
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
            {
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
            {
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
        ]
    }
}
