import React, { useContext, useEffect } from "react"
import { deepmerge } from "@mui/utils"
import { setListeners } from "../lib/events"
import { ContextValue, EditorContext } from "./Context"
import { getDefaultDataByType, getElementByType } from "./elements"
import { CanvasElement, PickElement } from "../types"
import { useBridge } from "./utils/useBridge"
import { DeepPartial } from "tsdef"

function makeId() {
    return Math.floor(Math.random() * 1e8)
}

function createCanvasElement<T extends CanvasElement["type"]>(type: T) {
    const newElement: PickElement<T> = {
        id: makeId(),
        type,
        rect: {
            x: 0,
            y: 0,
            width: 200,
            height: 100,
            rotation: 0
        },
        data: getDefaultDataByType(type)
    } as any
    if (type === "image") {
        const data = newElement.data as PickElement<"image">["data"]
        data.naturalWidth = 200
        data.naturalHeight = 100
    }
    return newElement
}

function getCanvasStyles(canvas: ContextValue["canvas"]) {
    return {
        backgroundColor: canvas.backgroundColor,
        width: canvas.width,
        height: canvas.height
    }
}

function Canvas() {
    useBridge()

    const context = useContext(EditorContext)

    const setNewElement = (newElement: CanvasElement) => {
        context.set({
            interactions: {
                focus: newElement.id
            },
            canvas: {
                elements: [...context.canvas.elements, newElement]
            }
        })
    }

    const handleCreateElement = (partial: DeepPartial<CanvasElement>) => {
        if (!partial.type) {
            throw new Error("Element type is not defined in 'element.create.partial'")
        }
        setNewElement(deepmerge(
            createCanvasElement(partial.type),
            partial
        ))
    }

    const handleCreateElementDefault = (type: CanvasElement["type"]) => {
        setNewElement(createCanvasElement(type))
    }

    const handleRemoveElement = (id: CanvasElement["id"]) => {
        const index = context.canvas.elements.findIndex(
            (_element) => _element.id === id
        )
        context.canvas.elements.splice(index, 1)
        context.set({})
    }

    useEffect(() =>
        setListeners(context.events, [
            ["element.create", handleCreateElement],
            ["element.create.default", handleCreateElementDefault],
            ["element.remove", handleRemoveElement]
        ])
    )
    
    return (
        <div style={getCanvasStyles(context.canvas)}>
            {context.canvas.elements.map((element) =>
                React.createElement(getElementByType(element.type), {
                    element,
                    key: element.id
                })
            )}
        </div>
    )
}

export default Canvas
