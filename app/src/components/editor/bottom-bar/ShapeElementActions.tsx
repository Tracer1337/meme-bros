import React, { useRef } from "react"
import { StyleSheet, View } from "react-native"
import { Surface, useTheme } from "react-native-paper"
import BottomSheet from "@gorhom/bottom-sheet"
import { colors, shapeVariants } from "@meme-bros/client-lib"
import CommonElementActions from "./CommonElementActions"
import Select from "../../inputs/Select"
import NumberInput from "../../inputs/NumberInput"
import { useShapeElementActions } from "../utils/actions"
import { useFocusedElement } from "../utils/canvas"

function ShapeElementActions() {
    const theme = useTheme()

    const bottomSheetRef = useRef<BottomSheet>(null)

    const { setData } = useShapeElementActions()

    const element = useFocusedElement<"shape">()

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
                <CommonElementActions bottomSheet={bottomSheetRef}/>
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
