import React, { useRef } from "react"
import { StyleSheet } from "react-native"
import { Surface, useTheme } from "react-native-paper"
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet"
import { useSharedContext } from "@meme-bros/client-lib"
import { useActions } from "./utils/actions"

function DrawingActions() {
    const context = useSharedContext()

    const theme = useTheme()

    const bottomSheetRef = useRef<BottomSheet>(null)

    const { action } = useActions({ bottomSheetRef })

    return (
        <BottomSheet
            ref={bottomSheetRef}
            snapPoints={[80, 300]}
            index={0}
            backgroundComponent={Surface}
            handleIndicatorStyle={{
                backgroundColor: theme.colors.onSurface
            }}
        >
            <BottomSheetView style={styles.actions}>
                {action(
                    "arrow-left",
                    () => context.set({ drawing: { isDrawing: false } })
                )}
                {action("cog", () => context.events.emit("drawing.config"))}
            </BottomSheetView>
        </BottomSheet>
    )
}

const styles = StyleSheet.create({
    actions: {
        flex: 1,
        flexDirection: "row"
    }
})

export default DrawingActions
