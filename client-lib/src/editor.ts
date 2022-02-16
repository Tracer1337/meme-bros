import * as Core from "@meme-bros/core-types"
import { Editor } from "@meme-bros/shared"

export function renderCanvas(editorCanvas: Editor.Canvas): Core.Canvas {
    return {
        ...editorCanvas,
        elements: editorCanvas.layers.map((id) => editorCanvas.elements[id])
    }
}

function getImageDefaultData(): Editor.PickElement<"image">["data"] {
    return {
        uri: "https://via.placeholder.com/200x100",
        animated: false,
        loop: true,
        borderRadius: 0,
        keepAspectRatio: true,
        naturalWidth: 0,
        naturalHeight: 0
    }
}

function getTextboxDefaultData(): Editor.PickElement<"textbox">["data"] {
    return {
        text: "Enter Text...",
        fontFamily: "Impact",
        fontWeight: "normal",
        textAlign: "center",
        verticalAlign: "center",
        color: "#ffffff",
        caps: true,
        outlineWidth: 2,
        outlineColor: "#000000",
        backgroundColor: "transparent",
        padding: 8
    }
}

function getShapeDefaultData(): Editor.PickElement<"shape">["data"] {
    return {
        variant: "rect",
        backgroundColor: "transparent",
        borderColor: "#e74c3c",
        borderWidth: 5
    }
}

function getPathDefaultData(): Editor.PickElement<"path">["data"] {
    return {
        points: [],
        color: "#ff0000",
        width: 4
    }
}

const defaultDataMap: Record<Editor.CanvasElement["type"], () => any> = {
    "textbox": getTextboxDefaultData,
    "image": getImageDefaultData,
    "shape": getShapeDefaultData,
    "path": getPathDefaultData
}

export function getDefaultDataByType<T extends Editor.CanvasElement["type"]>(
    type: T
): Editor.PickElement<T>["data"] {
    return defaultDataMap[type]()
}
