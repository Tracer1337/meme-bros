import React from "react"
import { StyleSheet, View } from "react-native"
import { colors, shapeVariants } from "@meme-bros/client-lib"
import CommonElementActions from "./CommonElementActions"
import Select from "../../inputs/Select"
import NumberInput from "../../inputs/NumberInput"
import { useShapeElementActions } from "../utils/actions"
import { useFocusedElement } from "../utils/canvas"

function ShapeElementActions() {
    const { setData } = useShapeElementActions()

    const element = useFocusedElement<"shape">()

    if (!element || element.type !== "shape") {
        return <></>
    }

    return (
        <>
            <View style={styles.actions}>
                <CommonElementActions/>
            </View>
            <Select
                style={styles.input}
                items={colors}
                label="Border Color"
                value={element.data.borderColor}
                onChange={(borderColor) => setData({ borderColor })}
            />
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
        </>
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
