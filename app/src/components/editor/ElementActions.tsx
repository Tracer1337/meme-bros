import React, { useRef } from "react"
import { StyleSheet } from "react-native"
import { Surface, useTheme } from "react-native-paper"
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet"
import {
    copyElement,
    layerElement,
    useSharedContext
} from "@meme-bros/client-lib"
import { useActions } from "./utils/actions"

function ElementActions() {
    const context = useSharedContext()

    const theme = useTheme()

    const bottomSheetRef = useRef<BottomSheet>(null)

    const { action } = useActions({ bottomSheetRef })

    const id = context.focus || 0

    return (
        <BottomSheet
            ref={bottomSheetRef}
            snapPoints={[80]}
            backgroundComponent={Surface}
            handleIndicatorStyle={{
                backgroundColor: theme.colors.onSurface
            }}
        >
            <BottomSheetView style={styles.actions}>
                {action("content-copy", () => context.set(copyElement(context, id)))}
                {action("flip-to-back", () => context.set(layerElement(context, id, -1)))}
                {action("flip-to-front", () => context.set(layerElement(context, id, 1)))}
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
