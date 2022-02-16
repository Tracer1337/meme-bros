export type Canvas = {
    width: number,
    height: number,
    pixelRatio: number,
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
    ShapeElement |
    PathElement
)

export type PickElement<
    T extends CanvasElement["type"]
> = Extract<CanvasElement, { type: T }>

export type ImageElement = {
    type: "image",
    data: {
        uri: string,
        borderRadius: number,
        loop: boolean
    }
}

export type TextboxElement = {
    type: "textbox",
    data: {
        text: string,
        fontFamily: string,
        fontWeight: string,
        textAlign: string,
        verticalAlign: string,
        color: Color,
        caps: boolean,
        outlineWidth: number,
        outlineColor: Color,
        backgroundColor: Color,
        padding: number
    }
}

export type ShapeElement = {
    type: "shape",
    data: {
        variant: string,
        backgroundColor: Color,
        borderColor: Color,
        borderWidth: number
    }
}

export type PathElement = {
    type: "path",
    data: {
        points: { x: number, y: number }[],
        color: Color,
        width: number
    }
}

export type ColorString = string
export type ColorRGBA = [number, number, number, number]
export type Color = ColorRGBA | ColorString

export type Rect = {
    x: number,
    y: number,
    width: number,
    height: number,
    rotation: number
}
