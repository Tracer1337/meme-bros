import { useRef } from "react"
import { StyleSheet, View } from "react-native"
import { Surface, useTheme } from "react-native-paper"
import BottomSheet from "@gorhom/bottom-sheet"
import CommonElementActions from "./CommonElementActions"
import NumberInput from "../../inputs/NumberInput"
import { useShapeElementActions } from "../utils/actions"
import { useFocusedElement } from "../utils/canvas"
import ColorSelect from "../../inputs/selects/ColorSelect"
import ShapeSelect from "../../inputs/selects/ShapeSelect"

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
            snapPoints={[170, 410]}
            backgroundComponent={Surface}
            handleIndicatorStyle={{
                backgroundColor: theme.colors.onSurface
            }}
        >
            <ShapeSelect
                style={styles.input}
                label="Shape"
                value={element.data.variant}
                onChange={(variant) => setData({ variant })}
            />
            <View style={styles.actions}>
                <CommonElementActions bottomSheet={bottomSheetRef}/>
            </View>
            <ColorSelect
                style={styles.input}
                label="Border Color"
                value={element.data.borderColor}
                onChange={(borderColor) => setData({ borderColor })}
                optional
            />
            <ColorSelect
                style={styles.input}
                label="Background Color"
                value={element.data.backgroundColor}
                onChange={(backgroundColor) => setData({ backgroundColor })}
                optional
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
