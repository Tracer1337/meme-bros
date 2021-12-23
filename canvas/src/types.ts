export type Canvas = {
    domRect: DOMRect | null,
    width: number,
    height: number,
    pixelRatio: number,
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

export type PickElement<T extends CanvasElement["type"]> = Extract<CanvasElement, { type: T }>

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
        color: ColorString,
        caps: boolean,
        outlineWidth: number,
        outlineColor: ColorString,
        backgroundColor: ColorString,
        padding: number
    }
}

export type ShapeElement = {
    type: "shape",
    data: {
        variant: string,
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
