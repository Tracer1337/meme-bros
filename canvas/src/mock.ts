import { Editor } from "@meme-bros/shared"
import { getDefaultDataByType } from "@meme-bros/client-lib"

export const mockCanvas: Editor.Canvas = {
    width: 500,
    height: 500,
    pixelRatio: 1,
    debug: false,
    mode: Editor.CanvasMode.CLASSIC,
    base: {
        id: 0,
        rounded: false,
        padding: false
    },
    backgroundColor: "#444444",
    elements: {
        0: {
            id: 0,
            type: "image",
            rect: {
                x: 0,
                y: 0,
                width: 500,
                height: 500,
                rotation: 0
            },
            data: {
                ...getDefaultDataByType("image"),
                uri: "https://imgflip.com/s/meme/Drake-Hotline-Bling.jpg"
            }
        },
        1: {
            id: 1,
            type: "textbox",
            rect: {
                x: 100,
                y: 200,
                width: 200,
                height: 100,
                rotation: 0
            },
            data: {
                ...getDefaultDataByType("textbox"),
                outlineWidth: 2,
                outlineColor: "#000000",
                color: "#ffffff"
            }
        }
    },
    layers: [0, 1]
}
