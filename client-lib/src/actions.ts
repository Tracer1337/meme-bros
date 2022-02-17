import produce, { setAutoFreeze } from "immer"
import { DeepPartial } from "tsdef"
import { Editor } from "@meme-bros/shared"
import { SharedContext } from "./context"
import { clone, makeId } from "./utils"

setAutoFreeze(false)

export const BASE_PADDING = 24
export const BASE_BORDER_RADIUS = 24

export function clearCanvas(): DeepPartial<SharedContext.ContextValue> {
    return {
        template: null,
        renderCanvas: false,
        canvas: {
            elements: {},
            layers: []
        }
    }
}

export function enableDrawing(): DeepPartial<SharedContext.ContextValue> {
    return {
        focus: null,
        drawing: {
            isDrawing: true
        }
    }
}

export function updateCanvasBase(
    state: SharedContext.ContextValue,
    base: Editor.CanvasBase
): DeepPartial<SharedContext.ContextValue> {
    const baseElement = state.canvas.elements[base.id] as Editor.PickElement<"image">
    const rect = base.rect || baseElement.rect
    return {
        canvas: {
            base: {
                ...base,
                rect
            },
            elements: {
                [baseElement.id]: {
                    rect: !base.padding ? rect : {
                        x: rect.x + BASE_PADDING,
                        y: rect.y + BASE_PADDING,
                        width: rect.width - BASE_PADDING * 2,
                        height: rect.height - BASE_PADDING * 2
                    },
                    data: {
                        borderRadius: base.rounded ? BASE_BORDER_RADIUS : 0
                    }
                }
            }
        }
    }
}

export function updateElementData<T extends Editor.CanvasElement["type"]>(
    _state: SharedContext.ContextValue,
    element: Editor.PickElement<T>,
    data: Editor.PickElement<T>["data"]
): DeepPartial<SharedContext.ContextValue> {
    return {
        canvas: {
            elements: {
                [element.id]: {
                    data: data as any
                }
            }
        }
    }
}

export function updateElementRect(
    _state: SharedContext.ContextValue,
    element: Editor.CanvasElement,
    rect: Editor.Rect
): DeepPartial<SharedContext.ContextValue> {
    return {
        canvas: {
            elements: {
                [element.id]: {
                    rect
                }
            }
        }
    }
}

export function addElement(
    state: SharedContext.ContextValue,
    element: Editor.CanvasElement
): DeepPartial<SharedContext.ContextValue> {
    return {
        focus: element.id,
        canvas: {
            elements: {
                [element.id]: element
            },
            layers: [...state.canvas.layers, element.id]
        }
    }
}

export function removeElement(
    state: SharedContext.ContextValue,
    id: number
): DeepPartial<SharedContext.ContextValue> {
    return {
        focus: state.focus === id ? null : state.focus,
        canvas: {
            layers: produce(state.canvas.layers, (layers) => {
                const index = layers.findIndex((_id) => id === _id)
                layers.splice(index, 1)
            })
        }
    }
}

export function copyElement(
    state: SharedContext.ContextValue,
    id: number
): DeepPartial<SharedContext.ContextValue> {
    const newElement = clone(state.canvas.elements[id])
    newElement.id = makeId()
    newElement.rect.x = 0
    newElement.rect.y = 0
    return {
        focus: newElement.id,
        canvas: {
            elements: {
                [newElement.id]: newElement
            },
            layers: [...state.canvas.layers, newElement.id]
        }
    }
}

export function layerElement(
    state: SharedContext.ContextValue,
    id: number,
    layer: -1 | 1
): DeepPartial<SharedContext.ContextValue> {
    return {
        canvas: {
            layers: produce(state.canvas.layers, (layers) => {
                const index = layers.findIndex((_id) => id === _id)
                layers.splice(index, 1)
                const firstElement = state.canvas.elements[layers[0]]
                if (layer === 1) {
                    layers.push(id)
                } else if (firstElement?.type === "image") {
                    layers.splice(1, 0, id)
                } else {
                    layers.unshift(id)
                }
            })
        }
    }
}

export function updateTextboxText(
    _state: SharedContext.ContextValue,
    element: Editor.PickElement<"textbox">,
    text: string
): DeepPartial<SharedContext.ContextValue> {
    return {
        canvas: {
            elements: {
                [element.id]: {
                    data: {
                        text
                    }
                }
            }
        }
    }
}
