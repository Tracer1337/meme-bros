import React, { useEffect, useRef } from "react"
import { deepmerge } from "@mui/utils"
import { DeepPartial } from "tsdef"
import * as CSS from "csstype"
import { Editor } from "@meme-bros/shared"
import {
    addElement,
    useSharedContext,
    SharedContext,
    removeElement,
    useListeners,
    makeListenerQueue,
    setDOMListeners
} from "@meme-bros/client-lib"
import { getElementByType } from "./elements"
import ResizeHandles from "./ResizeHandles"
import { AnimatedValueXY, useAnimationRegistry } from "../lib/animation"
import { getElementBasePosition } from "./elements/utils"
import { createCanvasElement } from "./utils/elements"
import DrawingCanvas from "./DrawingCanvas"

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

    const animations = useAnimationRegistry()

    const setQueuedListeners = useRef(makeListenerQueue<SharedContext.Events>()).current
    const canvasRef = useRef<HTMLDivElement>(null)

    const size = animations.useAnimation("canvas.size", new AnimatedValueXY())

    const handleCreateElement = async (partial: DeepPartial<Editor.CanvasElement>) => {
        if (!partial.type) {
            throw new Error("Element type is not defined in 'element.create'")
        }
        context.events.emit("history.push")
        context.set(addElement(context, deepmerge(
            await createCanvasElement(partial.type),
            partial
        )))
    }

    const handleCreateElementDefault = async (type: Editor.CanvasElement["type"]) => {
        context.events.emit("history.push")
        context.set(addElement(context, await createCanvasElement(type)))
    }

    const handleRemoveElement = (id: Editor.CanvasElement["id"]) => {
        context.events.emit("history.push")
        context.set(removeElement(context, id))
    }

    const updateTransform = () => {
        if (!canvasRef.current) {
            return
        }
        canvasRef.current.style.width = `${size.x.value}px`
        canvasRef.current.style.height = `${size.y.value}px`
    }

    const updateCanvas = () => {
        context.events.emit("history.push")
        const elements: DeepPartial<Editor.Canvas["elements"]> = {}
        if (context.canvas.base) {
            const baseElement = context.canvas.elements[context.canvas.base.id]
            elements[baseElement.id] = {
                rect: getElementBasePosition(
                    context.canvas.base,
                    size,
                    animations.getAnimationXY(`element.${baseElement.id}.size`)
                )
            }
        }
        context.set({
            canvas: {
                width: size.x.value,
                height: size.y.value,
                elements
            }
        })
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
                context.set({ focus: null })
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
        if (!canvasRef.current) {
            return
        }
        context.set({
            canvasDomRect: canvasRef.current.getBoundingClientRect()
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [canvasRef, context.canvas.width, context.canvas.height])
    
    return (
        <div style={getCanvasStyles(context.canvas)} ref={canvasRef}>
            <DrawingCanvas/>
            {context.canvas.layers.map((id) => {
                const element = context.canvas.elements[id]
                return React.createElement(getElementByType(element.type), {
                    element,
                    key: element.id
                })
            })}
            {context.focus === null && (
                <ResizeHandles onUpdate={updateCanvas}/>
            )}
        </div>
    )
}

export default Canvas
