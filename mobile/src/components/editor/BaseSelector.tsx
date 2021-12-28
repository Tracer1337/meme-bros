import React from "react"
import { useSharedContext } from "@meme-bros/shared"
import { StyleSheet } from "react-native"
import { Button, Surface } from "react-native-paper"

function BaseSelector() {
    const context = useSharedContext()

    return (
        <Surface style={styles.container}>
            <Button onPress={() => context.events.emit("canvas.base.import", null)}>
                Import
            </Button>
            <Button onPress={() => context.events.emit("canvas.base.blank", null)}>
                Blank
            </Button>
            {process.env.NODE_ENV === "development" && (
                <Button onPress={() => context.events.emit("canvas.base.dummy", null)}>
                    Load Dummy
                </Button>
            )}
        </Surface>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 8
    }
})

export default BaseSelector
