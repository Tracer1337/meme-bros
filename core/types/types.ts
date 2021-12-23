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
    ShapeElement
)

export type PickElement<
    T extends CanvasElement["type"]
> = Extract<CanvasElement, { type: T }>

export type ImageElement = {
    type: "image",
    data: {
        uri: string,
        animated: boolean,
        borderRadius: number,
        loop: boolean,
        keepAspectRatio: boolean,
        naturalWidth: number,
        naturalHeight: number
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

export type ColorString = string
export type ColorRGBA = [number, number, number, number]
export type Color = ColorString

export type Rect = {
    x: number,
    y: number,
    width: number,
    height: number,
    rotation: number
}
