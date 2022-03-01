import React, { useRef } from "react"
import { StyleSheet, View } from "react-native"
import { IconButton, Surface, useTheme } from "react-native-paper"
import BottomSheet from "@gorhom/bottom-sheet"
import { useSharedContext, colors } from "@meme-bros/client-lib"
import Select from "../../inputs/Select"
import NumberInput from "../../inputs/NumberInput"
import { useCallbacks } from "./utils/callbacks"
import { useDrawingActions } from "../utils/actions"

function DrawingActions() {
    const context = useSharedContext()

    const theme = useTheme()

    const bottomSheetRef = useRef<BottomSheet>(null)

    const callback = useCallbacks(bottomSheetRef)

    const { setData } = useDrawingActions()

    return (
        <BottomSheet
            ref={bottomSheetRef}
            snapPoints={[150, 240]}
            backgroundComponent={Surface}
            handleIndicatorStyle={{
                backgroundColor: theme.colors.onSurface
            }}
        >
            <Select
                style={styles.input}
                items={colors}
                label="Color"
                value={context.drawing.color}
                onChange={(color) => setData({ color })}
            />
            <View style={styles.actions}>
                <IconButton
                    color={theme.colors.onSurface}
                    icon="arrow-left"
                    onPress={callback(() => context.set({
                        drawing: { isDrawing: false }
                    }))}
                />
            </View>
            <NumberInput
                style={styles.input}
                mode="outlined"
                label="Width"
                value={context.drawing.width}
                onChange={(width) => setData({ width })}
            />
        </BottomSheet>
    )
}

const styles = StyleSheet.create({
    actions: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 8
    },

    input: {
        margin: 8,
        marginTop: 0
    }
})

export default DrawingActions
