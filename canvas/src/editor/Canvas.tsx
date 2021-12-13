import React, { useContext, useEffect } from "react"
import { Dimensions, View } from "react-native"
import { setListeners } from "../../lib/events"
import CoreModule from "../../lib/CoreModule"
import { ContextValue, EditorContext } from "./Context"
import { getDefaultDataByType, getElementByType } from "./elements"
import { DialogContext } from "../../lib/DialogHandler"
import { CanvasElement, PickElement } from "../../types"
import { importImage } from "../../lib/media"
import { renderCanvasState } from "./utils/render"
import BaseSelector from "./BaseSelector"

function makeId() {
    return Math.floor(Math.random() * 1e8)
}

function isImageElement(element: CanvasElement): element is PickElement<"image"> {
    return element.type === "image"
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
    }
    if (isImageElement(newElement)) {
        const image = await importImage()
        if (!image || !image.base64) {
            return
        }
        newElement.data.uri = image.base64
        newElement.data.animated = image.base64.startsWith("data:image/gif")
        if (image.width && image.height) {
            newElement.rect.width = newElement.data.naturalWidth = image.width
            newElement.rect.height = newElement.data.naturalHeight = image.height
        }
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

export function scaleToScreen(rect: { width: number, height: number }) {
    const width = Dimensions.get("window").width * 0.9
    return {
        width: width,
        height: width / rect.width * rect.height    
    }
}

function Canvas() {
    const context = useContext(EditorContext)
    const dialog = useContext(DialogContext)

    const handleScreenPress = () => {
        if (context.interactions.focus) {
            context.set({ interactions: { focus: null } })
        }
    }

    const handleBaseImport = async () => {
        const newElement = await createCanvasElement("image")
        if (!newElement) {
            return
        }
        newElement.id = 0
        const rect = scaleToScreen(newElement.rect)
        newElement.rect = { ...newElement.rect, ...rect }
        context.set({
            canvas: {
                ...rect,
                backgroundColor: "#ffffff",
                elements: [newElement]
            }
        })
    }

    const handleBaseBlank = async () => {
        const newElement = await createCanvasElement("shape")
        if (!newElement) {
            return
        }
        newElement.rect.width = 0
        newElement.rect.height = 0
        newElement.data.borderWidth = 0
        context.set({
            canvas: {
                ...scaleToScreen({ width: 500, height: 500 }),
                backgroundColor: "#ffffff",
                elements: [newElement]
            }
        })
    }

    const handleCreateElement = async (type: CanvasElement["type"]) => {
        const newElement = await createCanvasElement(type)
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

    const handleCanvasGenerate = async (state: ContextValue["canvas"]) => {
        const rendered = renderCanvasState(state)
        console.log("Generate", rendered)
        const base64 = await CoreModule.render(rendered)
        dialog.openDialog("GeneratedImageDialog", {
            uri: base64,
            width: context.canvas.width,
            height: context.canvas.height
        })
        context.events.emit("canvas.render.done", state)
    }

    const handleCanvasClear = () => {
        context.set({ canvas: { elements: [] } })
    }

    useEffect(() =>
        setListeners(context.events, [
            ["screen.press", handleScreenPress],
            ["canvas.base.import", handleBaseImport],
            ["canvas.base.blank", handleBaseBlank],
            ["element.create", handleCreateElement],
            ["element.remove", handleRemoveElement],
            ["canvas.render", handleCanvasGenerate],
            ["canvas.clear", handleCanvasClear]
        ])
    )

    useEffect(() => {
        const image = context.canvas.elements[0]
        if (!image) {
            return
        }
        image.rect.width = context.canvas.width
        image.rect.height = context.canvas.height
    }, [context.canvas.width, context.canvas.height])

    if (context.canvas.elements.length === 0) {
        return <BaseSelector/>
    }
    
    return (
        <View style={getCanvasStyles(context.canvas)}>
            {context.canvas.elements.map((element) =>
                React.createElement(getElementByType(element.type), {
                    element,
                    key: element.id
                })
            )}
        </View>
    )
}

export default Canvas
