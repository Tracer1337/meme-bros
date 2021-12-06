import colorConvert from "color-convert"
import { Canvas, CanvasElement } from "../../../types"

type RenderFunction = <
    T extends Record<K, any>,
    K extends keyof T
>(object: T, key: K) => void

export function renderCanvasState(state: Canvas) {
    const newState = JSON.parse(JSON.stringify(state)) as Canvas

    renderColor(newState, "backgroundColor")
    renderElements(newState, "elements")

    return newState
}

const renderElements: RenderFunction = (object, key) => {
    object[key].forEach((element: CanvasElement) => {
        switch (element.type) {
            case "textbox":
                renderColor(element.data, "color")
                renderColor(element.data, "backgroundColor")
                renderColor(element.data, "outlineColor")
                break
            case "shape":
                renderColor(element.data, "backgroundColor")
                renderColor(element.data, "borderColor")
        }
    })
}

const renderColor: RenderFunction = (object, key) => {
    if (object[key] === "transparent") {
        object[key] = [0, 0, 0, 0] as any
        return
    }
    const rgb = colorConvert.hex.rgb(object[key])
    object[key] = [...rgb, 255] as any
}
