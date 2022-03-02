import React from "react"
import { StyleSheet } from "react-native"
import { IconButton } from "react-native-paper"
import { useSharedContext } from "@meme-bros/client-lib"
import NumberInput from "../../inputs/NumberInput"
import { useDrawingActions } from "../utils/actions"
import ColorSelect from "../../inputs/selects/ColorSelect"

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
            <ColorSelect
                style={styles.input}
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
