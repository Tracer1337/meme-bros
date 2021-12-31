import React, { useContext, useEffect, useRef } from "react"
import { deepmerge } from "@mui/utils"
import { DeepPartial } from "tsdef"
import * as CSS from "csstype"
import {
    Editor,
    addElement,
    getDefaultDataByType,
    updateCanvasBase,
    useSharedContext,
    SharedContext,
    removeElement,
    useListeners
} from "@meme-bros/shared"
import { makeListenerQueue, setDOMListeners } from "../lib/events"
import { getElementByType } from "./elements"
import { getImageDimensions } from "../lib/image"
import { makeId } from "./utils"
import { DialogContext } from "../lib/DialogHandler"
import ResizeHandles from "./ResizeHandles"
import { AnimatedValueXY } from "../lib/animation"

async function createCanvasElement<
    T extends Editor.CanvasElement["type"]
>(type: T) {
    const newElement: Editor.PickElement<T> = {
        id: makeId(),
        type,
        interactive: true,
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
        const data = newElement.data as Editor.PickElement<"image">["data"]
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
        height: canvas.height + "px",
        position: "relative"
    }
}

function Canvas() {
    const context = useSharedContext()
    
    const dialogs = useContext(DialogContext)

    const setQueuedListeners = useRef(makeListenerQueue<SharedContext.Events>()).current
    const canvasRef = useRef<HTMLDivElement>(null)
    const size = useRef(new AnimatedValueXY()).current

    const handleCreateElement = async (partial: DeepPartial<Editor.CanvasElement>) => {
        if (!partial.type) {
            throw new Error("Element type is not defined in 'element.create'")
        }
        context.events.emit("history.push", null)
        context.set(addElement(context, deepmerge(
            await createCanvasElement(partial.type),
            partial
        )))
    }

    const handleCreateElementDefault = async (type: Editor.CanvasElement["type"]) => {
        context.events.emit("history.push", null)
        context.set(addElement(context, await createCanvasElement(type)))
    }

    const handleRemoveElement = (id: Editor.CanvasElement["id"]) => {
        context.events.emit("history.push", null)
        context.set(removeElement(context, id))
    }

    const handleCanvasBaseConfig = async () => {
        if (!context.canvas.base) {
            return
        }
        const base = await dialogs.open("CanvasBaseConfigDialog", context.canvas.base)
        context.set(updateCanvasBase(context, base))
    }

    const updateTransform = () => {
        if (!canvasRef.current) {
            return
        }
        canvasRef.current.style.width = `${size.x.value}px`
        canvasRef.current.style.height = `${size.y.value}px`
    }

    const updateCanvas = () => {
        context.events.emit("history.push", null)
        context.set({
            canvas: {
                width: size.x.value,
                height: size.y.value
            }
        })
    }

    useEffect(() =>
        setQueuedListeners(context.events, [
            ["element.create", handleCreateElement],
            ["element.create.default", handleCreateElementDefault],
            ["element.remove", handleRemoveElement],
            ["canvas.base.config", handleCanvasBaseConfig]
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

    useListeners(size, [["update", updateTransform]])

    useEffect(() => {
        size.emit("update", {
            x: context.canvas.width,
            y: context.canvas.height
        })
    }, [context.canvas.width, context.canvas.height, size])

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
            {context.canvas.layers.map((id) => {
                const element = context.canvas.elements[id]
                return React.createElement(getElementByType(element.type), {
                    element,
                    key: element.id
                })
            })}
            {context.interactions.focus === null && (
                <ResizeHandles
                    animate={size}
                    onUpdate={updateCanvas}
                />
            )}
        </div>
    )
}

export default Canvas
