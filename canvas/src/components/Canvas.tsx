import React, { useContext, useEffect, useRef } from "react"
import { deepmerge } from "@mui/utils"
import { DeepPartial } from "tsdef"
import { makeListenerQueue, setDOMListeners } from "../lib/events"
import { ContextValue, CanvasContext, Events, removeElement } from "./Context"
import { getDefaultDataByType, getElementByType } from "./elements"
import { CanvasElement, PickElement } from "../types"
import { useBridge } from "./utils/useBridge"
import { getImageDimensions } from "../lib/image"

function makeId() {
    return Math.floor(Math.random() * 1e8)
}

async function createCanvasElement<T extends CanvasElement["type"]>(type: T) {
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
        const { width, height } = await getImageDimensions(data.uri)
        data.naturalWidth = width
        data.naturalHeight = height
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

    const context = useContext(CanvasContext)

    const setQueuedListeners = useRef(makeListenerQueue<Events>()).current
    const canvasRef = useRef<HTMLDivElement>(null)

    const setNewElement = (newElement: CanvasElement) => {
        context.push()
        context.set({
            interactions: {
                focus: newElement.id
            },
            canvas: {
                elements: [...context.canvas.elements, newElement]
            }
        })
    }

    const handleCreateElement = async (partial: DeepPartial<CanvasElement>) => {
        if (!partial.type) {
            throw new Error("Element type is not defined in 'element.create'")
        }
        setNewElement(deepmerge(
            await createCanvasElement(partial.type),
            partial
        ))
    }

    const handleCreateElementDefault = async (type: CanvasElement["type"]) => {
        setNewElement(await createCanvasElement(type))
    }

    const handleRemoveElement = (id: CanvasElement["id"]) => {
        context.push()
        context.set(removeElement(context, id))
    }

    useEffect(() =>
        setQueuedListeners(context.events, [
            ["element.create", handleCreateElement],
            ["element.create.default", handleCreateElementDefault],
            ["element.remove", handleRemoveElement]
        ])
    )

    useEffect(() => {
        const handleClick = (event: TouchEvent) => {
            if (!canvasRef.current) {
                return
            }
            if (event.target === canvasRef.current ||
                event.target === canvasRef.current.parentElement) {
                context.set({ interactions: { focus: null } })
            }
        }
        return setDOMListeners(window, [
            ["click", handleClick],
            ["touchstart", handleClick]
        ])
    })

    useEffect(() => {
        if (!canvasRef.current) {
            return
        }
        context.set({
            canvas: {
                domRect: canvasRef.current.getBoundingClientRect()
            }
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [canvasRef])
    
    return (
        <div style={getCanvasStyles(context.canvas)} ref={canvasRef}>
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
