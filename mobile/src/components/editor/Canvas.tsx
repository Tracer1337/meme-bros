import React, { useContext, useEffect, useState } from "react"
import { Image, LayoutChangeEvent, StyleSheet, View } from "react-native"
import { Text } from "react-native-paper"
import { setListeners } from "../../lib/events"
import useId from "../../lib/useId"
import { EditorContext } from "./Context"
import { ElementTypes, getDefaultDataByType, getElementByType, PickElement } from "./elements"

function Canvas() {    
    const context = useContext(EditorContext)

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
        context.set({ canvas: { focus: null } })
    }

    const handleCreateElement = <T extends ElementTypes>(type: T) => {
        const newElement: PickElement<T> = {
            id: getId(),
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
        context.set({
            canvas: {
                elements: [...context.canvas.elements, newElement]
            }
        })
    }

    useEffect(() =>
        setListeners(context.events, [
            ["screen.press", handleScreenPress],
            ["element.create", handleCreateElement]
        ])
    )

    if (!context.canvas.imageSource) {
        return (
            <View>
                <Text>No image selected</Text>
            </View>
        )
    }
    
    return (
        <View style={styles.canvas} onLayout={handleCanvasLayout}>
            <Image
                source={context.canvas.imageSource}
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
