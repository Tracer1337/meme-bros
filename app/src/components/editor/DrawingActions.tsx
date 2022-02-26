import React from "react"
import { StyleSheet } from "react-native"
import { IconButton, Surface, useTheme } from "react-native-paper"
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet"
import { useSharedContext } from "@meme-bros/client-lib"

function DrawingActions() {
    const context = useSharedContext()

    const theme = useTheme()

    return (
        <BottomSheet
            snapPoints={[80, 300]}
            index={0}
            backgroundComponent={Surface}
            handleIndicatorStyle={{
                backgroundColor: theme.colors.onSurface
            }}
        >
            <BottomSheetView style={styles.actions}>
                <IconButton
                    color={theme.colors.onSurface}
                    icon="arrow-left"
                    onPress={() => context.set({
                        drawing: { isDrawing: false }
                    })}
                />
                <IconButton
                    color={theme.colors.onSurface}
                    icon="cog"
                    onPress={() => context.events.emit("drawing.config")}
                />
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
