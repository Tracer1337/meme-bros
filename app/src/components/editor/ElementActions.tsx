import React from "react"
import { StyleSheet } from "react-native"
import { IconButton, Surface, useTheme } from "react-native-paper"
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet"
import {
    copyElement,
    layerElement,
    useSharedContext
} from "@meme-bros/client-lib"

function ElementActions() {
    const context = useSharedContext()

    const theme = useTheme()

    const id = context.focus || 0

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
                    icon="content-copy"
                    onPress={() => context.set(copyElement(context, id))}
                />
                <IconButton
                    color={theme.colors.onSurface}
                    icon="flip-to-back"
                    onPress={() => context.set(layerElement(context, id, -1))}
                />
                <IconButton
                    color={theme.colors.onSurface}
                    icon="flip-to-front"
                    onPress={() => context.set(layerElement(context, id, 1))}
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

export default ElementActions
