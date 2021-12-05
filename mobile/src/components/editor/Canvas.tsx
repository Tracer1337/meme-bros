import React, { useContext, useEffect, useState } from "react"
import { LayoutChangeEvent, StyleSheet, View } from "react-native"
import { Text } from "react-native-paper"
import { setListeners } from "../../lib/events"
import CoreModule from "../../lib/CoreModule"
import { ContextValue, EditorContext } from "./Context"
import { getDefaultDataByType, getElementByType } from "./elements"
import { DialogContext } from "../../lib/DialogHandler"
import { CanvasElement, PickElement } from "../../types"
import { importImage } from "../../lib/media"

function makeId() {
    return Math.floor(Math.random() * 1e8)
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
        context.set({ interactions: { focus: null } })
    }

    const handleCreateElement = async <T extends CanvasElement["type"]>(type: T) => {
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
        if (type === "image") {
            const image = await importImage()
            if (!image || !image.base64) {
                return
            }
            ;(newElement as PickElement<"image">).data.uri = image.base64
            if (image.width && image.height) {
                newElement.rect.width = image.width
                newElement.rect.height = image.height
            }
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
        console.log("Generate", JSON.parse(JSON.stringify(state)))
        const base64 = await CoreModule.generate(state)
        dialog.openDialog("GeneratedImageDialog", {
            uri: base64,
            width: context.canvas.width,
            height: context.canvas.height
        })
        context.events.emit("canvas.generate.done", state)
    }

    useEffect(() =>
        setListeners(context.events, [
            ["screen.press", handleScreenPress],
            ["element.create", handleCreateElement],
            ["element.remove", handleRemoveElement],
            ["canvas.generate", handleCanvasGenerate]
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
        return (
            <View>
                <Text>No image selected</Text>
            </View>
        )
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
