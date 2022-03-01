import React from "react"
import { SharedContext, useSharedContext, colors } from "@meme-bros/client-lib"
import Select from "../../inputs/Select"
import NumberInput from "../../inputs/NumberInput"
import { IconButton } from "react-native-paper"
import { StyleSheet } from "react-native"

function DrawingConfig() {
    const context = useSharedContext()

    const setData = (
        drawing: Partial<SharedContext.ContextValue["drawing"]>
    ) => {
        context.set({ drawing })
    }

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
