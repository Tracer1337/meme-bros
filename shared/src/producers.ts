import produce, { setAutoFreeze } from "immer"
import { DeepPartial } from "tsdef"
import { Editor } from "./editor"
import { SharedContext } from "./context"
import { clone, makeId } from "./utils"

setAutoFreeze(false)

export function updateElementData(
    state: SharedContext.ContextValue,
    element: Editor.CanvasElement,
    data: Editor.CanvasElement["data"]
) {
    return produce(state, (draft) => {
        draft.canvas.elements[element.id].data = data
    })
}

export function updateElementRect(
    state: SharedContext.ContextValue,
    element: Editor.CanvasElement,
    rect: Editor.Rect
) {
    return produce(state, (draft) => {
        draft.canvas.elements[element.id].rect = rect
    })
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

export function removeElement(state: SharedContext.ContextValue, id: number) {
    return produce(state, (draft) => {
        const index = draft.canvas.layers.findIndex((_id) => id === _id)
        draft.canvas.layers.splice(index, 1)
        delete draft.canvas.elements[id]
        if (draft.interactions.focus === id) {
            draft.interactions.focus = null
        }
    })
}

export function copyElement(state: SharedContext.ContextValue, id: number) {
    return produce(state, (draft) => {
        const element = draft.canvas.elements[id]
        const newElement = clone(element)
        newElement.id = makeId()
        newElement.rect.x = 0
        newElement.rect.y = 0
        draft.canvas.elements[newElement.id] = newElement
        draft.canvas.layers.push(newElement.id)
        draft.interactions.focus = newElement.id
    })
}

export function layerElement(state: SharedContext.ContextValue, id: number, layer: -1 | 1) {
    return produce(state, (draft) => {
        const index = draft.canvas.layers.findIndex((_id) => id === _id)
        draft.canvas.layers.splice(index, 1)
        const firstElement = draft.canvas.elements[draft.canvas.layers[0]]
        if (layer === 1) {
            draft.canvas.layers.push(id)
        } else if (firstElement?.type === "image") {
            draft.canvas.layers.splice(1, 0, id)
        } else {
            draft.canvas.layers.unshift(id)
        }
    })
}

export function updateTextboxText(
    state: SharedContext.ContextValue,
    element: Editor.PickElement<"textbox">,
    text: string
) {
    return produce(state, (draft) => {
        const newElement = draft.canvas.elements[element.id] as Editor.PickElement<"textbox">
        newElement.data.text = text
    })
}
