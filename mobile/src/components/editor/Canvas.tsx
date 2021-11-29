import React, { useContext, useEffect, useState } from "react"
import { Image, LayoutChangeEvent, StyleSheet, View } from "react-native"
import { Text } from "react-native-paper"
import { setListeners } from "../../lib/events"
import CanvasModule from "../../lib/CanvasModule"
import useId from "../../lib/useId"
import { ContextValue, EditorContext } from "./Context"
import { Element, ElementTypes, getDefaultDataByType, getElementByType, PickElement } from "./elements"
import { DialogContext } from "../../lib/DialogHandler"

function Canvas() {
    const context = useContext(EditorContext)
    const dialog = useContext(DialogContext)

    const getId = useId()

    const [isLayoutLoaded, setIsLayoutLoaded] = useState(false)

    const handleCanvasLayout = (event: LayoutChangeEvent) => {
        context.set({
            dimensions: {
                width: event.nativeEvent.layout.width,
                height: event.nativeEvent.layout.height
            }
        })
        setIsLayoutLoaded(true)
    }

    const handleScreenPress = () => {
        context.set({ interactions: { focus: null } })
    }

    const handleCreateElement = <T extends ElementTypes>(type: T) => {
        const newElement: PickElement<T> = {
            id: getId(),
            type,
            rect: {
                x: 0,
                y: 0,
                width: 0.4,
                height: 0.2,
                rotation: 0
            },
            data: getDefaultDataByType(type)
        }
        context.set({
            canvas: {
                elements: [...context.canvas.elements, newElement]
            }
        })
    }

    const handleRemoveElement = (id: Element["id"]) => {
        const index = context.canvas.elements.findIndex(
            (_element) => _element.id === id
        )
        context.canvas.elements.splice(index, 1)
        context.set({})
    }

    const handleCanvasGenerate = async (state: ContextValue["canvas"]) => {
        console.log("Generate", JSON.parse(JSON.stringify(state)))
        const base64 = await CanvasModule.generate(state)
        dialog.openDialog("GeneratedImageDialog", {
            uri: base64,
            width: context.dimensions.width,
            height: context.dimensions.height
        })
    }

    useEffect(() =>
        setListeners(context.events, [
            ["screen.press", handleScreenPress],
            ["element.create", handleCreateElement],
            ["element.remove", handleRemoveElement],
            ["canvas.generate", handleCanvasGenerate]
        ])
    )

    if (!context.canvas.image) {
        return (
            <View>
                <Text>No image selected</Text>
            </View>
        )
    }
    
    return (
        <View style={styles.canvas} onLayout={handleCanvasLayout}>
            <Image
                source={context.canvas.image}
                style={styles.image}
            />
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
