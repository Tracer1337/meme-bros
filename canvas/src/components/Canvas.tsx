import React, { useContext, useEffect, useRef } from "react"
import { deepmerge } from "@mui/utils"
import { DeepPartial } from "tsdef"
import { makeListenerQueue } from "../lib/events"
import { ContextValue, EditorContext, Events } from "./Context"
import { getDefaultDataByType, getElementByType } from "./elements"
import { Canvas as CanvasType, CanvasElement, PickElement } from "../types"
import { useBridge } from "./utils/useBridge"

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

    const setQueuedListeners = useRef(makeListenerQueue<Events>()).current

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
            throw new Error("Element type is not defined in 'element.create'")
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

    const handleCanvasClear = () => {
        context.set({ canvas: { elements: [] } })
    }

    const handleCanvasDimensionsSet = (dim: Pick<CanvasType, "width" | "height">) => {
        context.set({ canvas: dim })
    }

    useEffect(() =>
        setQueuedListeners(context.events, [
            ["element.create", handleCreateElement],
            ["element.create.default", handleCreateElementDefault],
            ["element.remove", handleRemoveElement],
            ["canvas.clear", handleCanvasClear],
            ["canvas.dimensions.set", handleCanvasDimensionsSet]
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
