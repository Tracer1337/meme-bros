import produce, { setAutoFreeze } from "immer"
import { Editor } from "./editor"
import { SharedContext } from "./context"
import { clone, makeId } from "./utils"

setAutoFreeze(false)

export function updateElementData<T extends Editor.CanvasElement["type"]>(
    state: SharedContext.ContextValue,
    element: Editor.PickElement<T>,
    data: Editor.PickElement<T>["data"]
) {
    return produce(state, (draft) => {
        const newElement = draft.canvas.elements.find(
            (e) => e.id === element.id
        ) as Editor.PickElement<T>
        if (newElement) {
            newElement.data = data
        }
    })
}

export function updateElementRect(
    state: SharedContext.ContextValue,
    element: Editor.CanvasElement,
    rect: Editor.Rect
) {
    return produce(state, (draft) => {
        const newElement = draft.canvas.elements.find(
            (e) => e.id === element.id
        )
        if (!newElement) {
            return
        }
        newElement.rect = rect
    })
}

export function removeElement(state: SharedContext.ContextValue, id: number) {
    return produce(state, (draft) => {
        const index = draft.canvas.elements.findIndex(
            (e) => e.id === id
        )
        draft.canvas.elements.splice(index, 1)
        if (draft.interactions.focus === id) {
            draft.interactions.focus = null
        }
    })
}

export function copyElement(state: SharedContext.ContextValue, id: number) {
    return produce(state, (draft) => {
        const element = draft.canvas.elements.find((e) => e.id === id)
        if (!element) {
            return
        }
        const newElement = clone(element)
        newElement.id = makeId()
        newElement.rect.x = 0
        newElement.rect.y = 0
        draft.canvas.elements.push(newElement)
        draft.interactions.focus = newElement.id
    })
}

export function layerElement(state: SharedContext.ContextValue, id: number, layer: -1 | 1) {
    return produce(state, (draft) => {
        const index = draft.canvas.elements.findIndex(
            (e) => e.id === id
        )
        const element = draft.canvas.elements[index]
        if (!element) {
            return
        }
        draft.canvas.elements.splice(index, 1)
        if (layer === 1) {
            draft.canvas.elements.push(element)
        } else if (draft.canvas.elements[0]?.type === "image") {
            draft.canvas.elements.splice(1, 0, element)
        } else {
            draft.canvas.elements.unshift(element)
        }
    })
}

export function updateTextboxText(
    state: SharedContext.ContextValue,
    element: Editor.PickElement<"textbox">,
    text: string
) {
    return produce(state, (draft) => {
        const newElement = draft.canvas.elements.find(
            (e) => e.id === element.id
        ) as Editor.PickElement<"textbox">
        if (!newElement) {
            return
        }
        newElement.data.text = text
    })
}
