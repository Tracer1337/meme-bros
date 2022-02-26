import React, { useRef } from "react"
import { StyleSheet, View } from "react-native"
import { Surface, useTheme } from "react-native-paper"
import BottomSheet from "@gorhom/bottom-sheet"
import { Editor } from "@meme-bros/shared"
import {
    updateElementData,
    useSharedContext,
    colors,
    shapeVariants
} from "@meme-bros/client-lib"
import { useActions } from "./utils/actions"
import CommonElementActions from "./CommonElementActions"
import Select from "../inputs/Select"
import NumberInput from "../inputs/NumberInput"

function ShapeElementActions() {
    const context = useSharedContext()

    const element = context.canvas.elements[
        context.focus || -1
    ] as Editor.PickElement<"shape">

    const theme = useTheme()

    const bottomSheetRef = useRef<BottomSheet>(null)

    const { action } = useActions({ bottomSheetRef })

    const setData = (
        data: Partial<Editor.PickElement<"shape">["data"]>
    ) => {
        context.set(updateElementData(context, element, data))
    }

    if (!element || element.type !== "shape") {
        return <></>
    }

    return (
        <BottomSheet
            ref={bottomSheetRef}
            snapPoints={[150, 380]}
            backgroundComponent={Surface}
            handleIndicatorStyle={{
                backgroundColor: theme.colors.onSurface
            }}
        >
            <Select
                style={styles.input}
                items={colors}
                label="Border Color"
                value={element.data.borderColor}
                onChange={(borderColor) => setData({ borderColor })}
            />
            <View style={styles.actions}>
                <CommonElementActions action={action}/>
            </View>
            <Select
                style={styles.input}
                items={shapeVariants}
                label="Shape"
                value={element.data.variant}
                onChange={(variant) => setData({ variant })}
            />
            <Select
                style={styles.input}
                items={colors}
                label="Background Color"
                value={element.data.backgroundColor}
                onChange={(backgroundColor) => setData({ backgroundColor })}
            />
            <NumberInput
                style={styles.input}
                mode="outlined"
                label="Border Width"
                value={element.data.borderWidth}
                onChange={(borderWidth) => setData({ borderWidth })}
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

export default ShapeElementActions
