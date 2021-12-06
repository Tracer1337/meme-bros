export type Canvas = {
    width: number,
    height: number,
    debug: boolean,
    backgroundColor: Color,
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
        color: Color,
        caps: boolean,
        outlineWidth: number,
        outlineColor: Color,
        backgroundColor: Color
    }
}

export type ShapeElement = {
    type: "shape",
    data: {
        variant: "rect" | "ellipse",
        backgroundColor: Color,
        borderColor: Color,
        borderWidth: number
    }
}

export type Color = [number, number, number, number]

export type Rect = {
    x: number,
    y: number,
    width: number,
    height: number,
    rotation: number
}
