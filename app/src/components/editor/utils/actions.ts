import { useState } from "react"
import { Editor } from "@meme-bros/shared"
import {
    SharedContext,
    updateCanvasBase,
    updateElementData,
    useListeners,
    useSharedContext
} from "@meme-bros/client-lib"
import { useCanvasUtils, useFocusedElement } from "./canvas"

export function useCanvasActions() {
    const context = useSharedContext()

    const { createCanvasElement } = useCanvasUtils()

    const [isRendering, setIsRendering] = useState(false)

    const createElement = async (type: Editor.CanvasElement["type"]) => {
        if (!type) {
            return
        }
        const partial = await createCanvasElement(type)
        if (!partial) {
            return
        }
        context.events.emit("element.create", partial)
    }

    const setBase = (base: Partial<Editor.CanvasBase>) => {
        if (!context.canvas.base) return
        context.events.emit("history.push")
        context.set(updateCanvasBase(context, {
            ...context.canvas.base,
            ...base
        }))
    }

    const render = () => {
        setIsRendering(true)
        requestAnimationFrame(() => {
            context.events.emit("canvas.render")
        })
    }

    useListeners(context.events, [
        ["canvas.render.done", () => setIsRendering(false)]
    ])

    return {
        createElement,
        setBase,
        render,
        isRendering
    }
}

export function useDrawingActions() {
    const context = useSharedContext()
    
    const setData = (
        drawing: Partial<SharedContext.ContextValue["drawing"]>
    ) => {
        context.set({ drawing })
    }

    return { setData }
}

export function useImageElementActions() {
    const context = useSharedContext()

    const element = useFocusedElement<"image">()
    
    const setData = (
        data: Partial<Editor.PickElement<"image">["data"]>
    ) => {
        if (!element) return
        context.events.emit("history.push")
        context.set(updateElementData(context, element, data))
    }

    return { setData }
}

export function useShapeElementActions() {
    const context = useSharedContext()

    const element = useFocusedElement<"shape">()
    
    const setData = (
        data: Partial<Editor.PickElement<"shape">["data"]>
    ) => {
        if (!element) return
        context.events.emit("history.push")
        context.set(updateElementData(context, element, data))
    }

    return { setData }
}

export function useTextboxElementActions() {
    const context = useSharedContext()

    const element = useFocusedElement<"textbox">()
    
    const setData = (
        data: Partial<Editor.PickElement<"textbox">["data"]>
    ) => {
        if (!element) return
        context.events.emit("history.push")
        context.set(updateElementData(context, element, data))
    }

    return { setData }
}
