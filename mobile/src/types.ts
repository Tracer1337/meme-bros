export type Canvas = {
    width: number,
    height: number,
    debug: boolean,
    backgroundColor: ColorString,
    elements: CanvasElement[]
}

export type CanvasElementCommon = {
    id: number,
    type: string,
    rect: Rect,
    data: {}
}

export type CanvasElement = CanvasElementCommon & (
    ImageElement |
    TextboxElement |
    ShapeElement
)

export type PickElement<T extends CanvasElement["type"]> = CanvasElement & { type: T }

export type ImageElement = {
    type: "image",
    data: {
        uri: string,
        borderRadius: number,
        keepAspectRatio: boolean,
        naturalWidth: number,
        naturalHeight: number
    }
}

export type TextboxElement = {
    type: "textbox",
    data: {
        text: string,
        fontFamily: "Arial" | "Comic-Sans" | "Impact",
        fontWeight: "normal" | "bold",
        textAlign: "left" | "center" | "right",
        color: ColorString,
        caps: boolean,
        outlineWidth: number,
        outlineColor: ColorString,
        backgroundColor: ColorString
    }
}

export type ShapeElement = {
    type: "shape",
    data: {
        variant: "rect" | "ellipse",
        backgroundColor: ColorString,
        borderColor: ColorString,
        borderWidth: number
    }
}

export type ColorString = string
export type ColorRGBA = [number, number, number, number]

export type Rect = {
    x: number,
    y: number,
    width: number,
    height: number,
    rotation: number
}
