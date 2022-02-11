export type Color = string

export type Canvas = {
    width: number,
    height: number,
    pixelRatio: number
    debug?: boolean,
    backgroundColor: Color,
    elements: CanvasElement[]
}

export type CanvasElement = (
    ImageElement |
    TextboxElement |
    ShapeElement
)

export type ImageElement = {
    type: "image",
    rect: Rect,
    data: {
        uri: string,
        borderRadius?: number
    }
}

export type TextboxElement = {
    type: "textbox",
    rect: Rect,
    data: {
        text: string,
        fontFamily?: string,
        fontWeight?: string,
        textAlign?: string,
        verticalAlign?: string,
        color: Color,
        caps?: boolean,
        outlineWidth?: number,
        outlineColor?: Color,
        backgroundColor?: Color,
        padding?: number
    }
}

export type ShapeElement = {
    type: "shape",
    rect: Rect,
    data: {
        variant?: string,
        backgroundColor?: Color,
        borderColor?: Color,
        borderWidth?: number
    }
}

export type Rect = {
    x: number,
    y: number,
    width: number,
    height: number,
    rotation: number
}
