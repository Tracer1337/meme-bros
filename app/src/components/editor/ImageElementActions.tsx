import React, { useRef } from "react"
import { StyleSheet, View } from "react-native"
import { Surface, useTheme } from "react-native-paper"
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet"
import { Editor } from "@meme-bros/shared"
import { updateElementData, useSharedContext } from "@meme-bros/client-lib"
import { useActions } from "./utils/actions"
import CommonElementActions from "./CommonElementActions"
import NumberInput from "../inputs/NumberInput"
import Switch from "../inputs/Switch"

function ImageElementActions() {
    const context = useSharedContext()

    const element = context.canvas.elements[
        context.focus || -1
    ] as Editor.PickElement<"image">

    const theme = useTheme()

    const bottomSheetRef = useRef<BottomSheet>(null)

    const { action } = useActions({ bottomSheetRef })

    const setData = (
        data: Partial<Editor.PickElement<"image">["data"]>
    ) => {
        context.set(updateElementData(context, element, data))
    }

    if (!element || element.type !== "image") {
        return <></>
    }

    return (
        <BottomSheet
            ref={bottomSheetRef}
            snapPoints={[150, 210]}
            backgroundComponent={Surface}
            handleIndicatorStyle={{
                backgroundColor: theme.colors.onSurface
            }}
        >
            <NumberInput
                style={styles.input}
                label="Border Radius"
                mode="outlined"
                value={element.data.borderRadius}
                onChange={(borderRadius) => setData({ borderRadius })}
            />
            <View style={styles.actions}>
                <CommonElementActions action={action}/>
            </View>
            <BottomSheetView style={{ flex: 1 }}>
                <Switch
                    style={styles.input}
                    label="Keep Aspect Ratio"
                    value={element.data.keepAspectRatio}
                    onChange={(keepAspectRatio) => setData({ keepAspectRatio })}
                />
            </BottomSheetView>
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

export default ImageElementActions
