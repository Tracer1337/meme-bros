import React, { useContext } from "react"
import { StyleSheet } from "react-native"
import { Button, Surface } from "react-native-paper"
import { EditorContext } from "./Context"

function BaseSelector() {
    const context = useContext(EditorContext)

    return (
        <Surface style={styles.container}>
            <Button onPress={() => context.events.emit("canvas.base.import", null)}>
                Import
            </Button>
            <Button onPress={() => context.events.emit("canvas.base.dummy", null)}>
                Load Dummy
            </Button>
        </Surface>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 8
    }
})

export default BaseSelector
