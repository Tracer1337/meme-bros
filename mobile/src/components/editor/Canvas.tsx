import React, { useContext } from "react"
import { Image, LayoutChangeEvent, StyleSheet, View } from "react-native"
import { Text } from "react-native-paper"
import { EditorContext } from "./Context"
import Textbox from "./elements/Textbox"

function Canvas() {    
    const context = useContext(EditorContext)

    const handleCanvasLayout = (event: LayoutChangeEvent) => {
        context.set({
            dimensions: {
                width: event.nativeEvent.layout.width,
                height: event.nativeEvent.layout.height
            }
        })
    }

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
            <Textbox/>
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
