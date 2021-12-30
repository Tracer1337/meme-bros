import produce, { setAutoFreeze } from "immer"
import { DeepPartial } from "tsdef"
import { Editor } from "./editor"
import { SharedContext } from "./context"
import { clone, makeId } from "./utils"

setAutoFreeze(false)

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
        interactions: {
            focus: element.id
        },
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
        interactions: {
            focus: state.interactions.focus === id
                ? null
                : state.interactions.focus
        },
        canvas: {
            elements: produce(state.canvas.elements, (elements) => {
                delete elements[id]
            }),
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
        interactions: {
            focus: newElement.id
        },
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
