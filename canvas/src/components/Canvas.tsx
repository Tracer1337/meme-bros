import React, { useEffect, useRef } from "react"
import { deepmerge } from "@mui/utils"
import { DeepPartial } from "tsdef"
import * as CSS from "csstype"
import * as Core from "@meme-bros/core"
import { setListeners, useBridge, useSharedContext, SharedContext, removeElement } from "@meme-bros/shared"
import { makeListenerQueue, setDOMListeners } from "../lib/events"
import { getDefaultDataByType, getElementByType } from "./elements"
import { getImageDimensions } from "../lib/image"
import { makeId } from "./utils"

async function createCanvasElement<T extends Core.CanvasElement["type"]>(type: T) {
    const newElement: Core.PickElement<T> = {
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
        const data = newElement.data as Core.PickElement<"image">["data"]
        const { width, height } = await getImageDimensions(data.uri)
        data.naturalWidth = width
        data.naturalHeight = height
    }
    return newElement
}

function getCanvasStyles(canvas: SharedContext.ContextValue["canvas"]): CSS.Properties {
    return {
        backgroundColor: canvas.backgroundColor,
        width: canvas.width + "px",
        height: canvas.height + "px"
    }
}

function Canvas() {
    const context = useSharedContext()

    const bridge = useBridge()

    useEffect(() => setListeners(bridge, [
        ["element.create", (e) => context.events.emit("element.create", e)],
        ["element.create.default", (e) => context.events.emit("element.create.default", e)],
        ["canvas.undo", context.pop],
    ]))

    const setQueuedListeners = useRef(makeListenerQueue<SharedContext.Events>()).current
    const canvasRef = useRef<HTMLDivElement>(null)

    const setNewElement = (newElement: Core.CanvasElement) => {
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

    const handleCreateElement = async (partial: DeepPartial<Core.CanvasElement>) => {
        if (!partial.type) {
            throw new Error("Element type is not defined in 'element.create'")
        }
        setNewElement(deepmerge(
            await createCanvasElement(partial.type),
            partial
        ))
    }

    const handleCreateElementDefault = async (type: Core.CanvasElement["type"]) => {
        setNewElement(await createCanvasElement(type))
    }

    const handleRemoveElement = (id: Core.CanvasElement["id"]) => {
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
        requestAnimationFrame(() => {
            if (!canvasRef.current) {
                return
            }
            context.set({
                canvasDomRect: canvasRef.current.getBoundingClientRect()
            })
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
