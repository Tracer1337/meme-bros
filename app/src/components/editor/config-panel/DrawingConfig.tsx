import React from "react"
import { StyleSheet } from "react-native"
import { IconButton } from "react-native-paper"
import { useSharedContext, colors } from "@meme-bros/client-lib"
import Select from "../../inputs/Select"
import NumberInput from "../../inputs/NumberInput"
import { useDrawingActions } from "../utils/actions"

function DrawingConfig() {
    const context = useSharedContext()

    const { setData } = useDrawingActions()

    return (
        <>
            <IconButton
                style={styles.input}
                icon="arrow-left"
                onPress={() => context.set({
                    drawing: { isDrawing: false }
                })}
            />
            <Select
                style={styles.input}
                items={colors}
                label="Color"
                value={context.drawing.color}
                onChange={(color) => setData({ color })}
            />
            <NumberInput
                style={styles.input}
                mode="outlined"
                label="Width"
                value={context.drawing.width}
                onChange={(width) => setData({ width })}
            />
        </>
    )
}

const styles = StyleSheet.create({
    input: {
        margin: 8,
        marginTop: 0
    }
})

export default DrawingConfig
