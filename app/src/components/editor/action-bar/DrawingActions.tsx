import React, { useRef } from "react"
import { StyleSheet, View } from "react-native"
import { Surface, useTheme } from "react-native-paper"
import BottomSheet from "@gorhom/bottom-sheet"
import { SharedContext, useSharedContext, colors } from "@meme-bros/client-lib"
import { useActions } from "./utils/actions"
import Select from "../../inputs/Select"
import NumberInput from "../../inputs/NumberInput"

function DrawingActions() {
    const context = useSharedContext()

    const theme = useTheme()

    const bottomSheetRef = useRef<BottomSheet>(null)

    const { action } = useActions({ bottomSheetRef })

    const setData = (
        drawing: Partial<SharedContext.ContextValue["drawing"]>
    ) => {
        context.set({ drawing })
    }

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
                {action(
                    "arrow-left",
                    () => context.set({ drawing: { isDrawing: false } })
                )}
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
