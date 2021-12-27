import React, { useContext, useEffect, useRef } from "react"
import { deepmerge } from "@mui/utils"
import { DeepPartial } from "tsdef"
import * as CSS from "csstype"
import * as Core from "@meme-bros/core"
import { useBridge, useWindowMessaging } from "@meme-bros/bridge"
import { makeListenerQueue, setDOMListeners } from "../lib/events"
import { ContextValue, CanvasContext, Events, removeElement, copyElement } from "./Context"
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

function getCanvasStyles(canvas: ContextValue["canvas"]): CSS.Properties {
    return {
        backgroundColor: canvas.backgroundColor,
        width: canvas.width + "px",
        height: canvas.height + "px"
    }
}

function Canvas() {
    const context = useContext(CanvasContext)

    const { messages, send } = useWindowMessaging()
    const request = useBridge(messages, send, {
        "element.create": (e) => context.events.emit("element.create", e),
        "element.create.default": (e) => context.events.emit("element.create.default", e),
        "element.copy": (id) => context.set(copyElement(context, id)),
        "canvas.render": () => context.canvas,
        "canvas.set": (partial) => context.set({ canvas: partial }),
        "canvas.undo": () => context.pop()
    })

    const setQueuedListeners = useRef(makeListenerQueue<Events>()).current
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
        if (!canvasRef.current) {
            return
        }
        context.set({
            canvasDomRect: canvasRef.current.getBoundingClientRect()
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [canvasRef])
    
    useEffect(() => {
        request("element.focus", context.interactions.focus)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context.interactions.focus])
    
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
