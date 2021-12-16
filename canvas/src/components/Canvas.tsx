import React, { useContext, useEffect } from "react"
import { setListeners } from "../lib/events"
import { ContextValue, EditorContext } from "./Context"
import { getDefaultDataByType, getElementByType } from "./elements"
import { CanvasElement, PickElement } from "../types"

function makeId() {
    return Math.floor(Math.random() * 1e8)
}

function createCanvasElement<T extends CanvasElement["type"]>(type: T) {
    const newElement: PickElement<T> = {
        id: makeId(),
        type: type as any,
        rect: {
            x: 0,
            y: 0,
            width: 200,
            height: 100,
            rotation: 0
        },
        data: getDefaultDataByType(type) as any
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
    const context = useContext(EditorContext)

    const handleCreateElement = (type: CanvasElement["type"]) => {
        const newElement = createCanvasElement(type)
        if (!newElement) {
            return
        }
        context.set({
            canvas: {
                elements: [...context.canvas.elements, newElement]
            }
        })
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
