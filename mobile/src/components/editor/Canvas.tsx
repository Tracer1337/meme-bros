import React, { useContext, useEffect, useState } from "react"
import { LayoutChangeEvent, StyleSheet, View } from "react-native"
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
        if (image.width && image.height) {
            newElement.rect.width = newElement.data.naturalWidth = image.width
            newElement.rect.height = newElement.data.naturalHeight = image.height
        }
    }
    return newElement
}

function Canvas() {
    const context = useContext(EditorContext)
    const dialog = useContext(DialogContext)
    
    const [isLayoutLoaded, setIsLayoutLoaded] = useState(false)
    const [dimensions, setDimensions] = useState<{
        width: number,
        height: number
    }>({ width: 0, height: 0 })

    const handleLayout = (event: LayoutChangeEvent) => {
        const { layout } = event.nativeEvent
        setDimensions({
            width: layout.width,
            height: layout.width / context.canvas.width * context.canvas.height
        })
        setIsLayoutLoaded(true)
    }

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
        context.set({
            canvas: {
                width: newElement.rect.width,
                height: newElement.rect.height,
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
        image.rect.width = dimensions.width
        image.rect.height = dimensions.height
        context.canvas.width = dimensions.width
        context.canvas.height = dimensions.height
    }, [dimensions])

    if (context.canvas.elements.length === 0) {
        return <BaseSelector/>
    }
    
    return (
        <View style={[styles.canvas, { height: dimensions.height }]} onLayout={handleLayout}>
            {isLayoutLoaded && context.canvas.elements.map((element) =>
                React.createElement(getElementByType(element.type), {
                    element,
                    key: element.id
                })
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    canvas: {
        width: "90%"
    },

    image: {
        width: "100%"
    }
})

export default Canvas
