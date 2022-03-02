import React, { useRef } from "react"
import { StyleSheet, View } from "react-native"
import { Surface, TextInput, useTheme } from "react-native-paper"
import BottomSheet from "@gorhom/bottom-sheet"
import { ScrollView } from "react-native-gesture-handler"
import CommonElementActions from "./CommonElementActions"
import NumberInput from "../../inputs/NumberInput"
import Switch from "../../inputs/Switch"
import { useTextboxElementActions } from "../utils/actions"
import { useFocusedElement } from "../utils/canvas"
import ColorSelect from "../../inputs/selects/ColorSelect"
import TextAlignSelect from "../../inputs/selects/TextAlignSelect"
import VerticalAlignSelect from "../../inputs/selects/VerticalAlignSelect"
import FontFamilySelect from "../../inputs/selects/FontFamilySelect"
import FontWeightSelect from "../../inputs/selects/FontWeightSelect"

function TextboxElementActions() {
    const theme = useTheme()

    const bottomSheetRef = useRef<BottomSheet>(null)

    const { setData } = useTextboxElementActions()

    const element = useFocusedElement<"textbox">()

    if (!element || element.type !== "textbox") {
        return <></>
    }

    return (
        <BottomSheet
            ref={bottomSheetRef}
            snapPoints={[150, "65%"]}
            backgroundComponent={Surface}
            handleIndicatorStyle={{
                backgroundColor: theme.colors.onSurface
            }}
        >
            <TextInput
                style={styles.input}
                label="Text"
                mode="outlined"
                value={element.data.text}
                onChangeText={(text: string) => setData({ text })}
            />
            <View style={styles.actions}>
                <CommonElementActions bottomSheet={bottomSheetRef}/>
            </View>
            <ScrollView style={styles.scrollActions}>
                <ColorSelect
                    style={styles.input}
                    label="Color"
                    value={element.data.color}
                    onChange={(color) => setData({ color })}
                />
                <NumberInput
                    style={styles.input}
                    mode="outlined"
                    label="Outline Width"
                    value={element.data.outlineWidth}
                    onChange={(value) => setData({
                        outlineWidth: Math.min(value, 5)
                    })}
                />
                <ColorSelect
                    style={styles.input}
                    label="Outline Color"
                    value={element.data.outlineColor}
                    onChange={(outlineColor) => setData({ outlineColor })}
                />
                <TextAlignSelect
                    style={styles.input}
                    label="Text Align"
                    value={element.data.textAlign}
                    onChange={(textAlign) => setData({ textAlign })}
                />
                <VerticalAlignSelect
                    style={styles.input}
                    label="Vertical Align"
                    value={element.data.verticalAlign}
                    onChange={(verticalAlign) => setData({ verticalAlign })}
                />
                <FontFamilySelect
                    style={styles.input}
                    label="Font Family"
                    value={element.data.fontFamily}
                    onChange={(fontFamily) => setData({ fontFamily })}
                />
                <FontWeightSelect
                    style={styles.input}
                    label="Font Weight"
                    value={element.data.fontWeight}
                    onChange={(fontWeight) => setData({ fontWeight })}
                />
                <Switch
                    style={styles.input}
                    label="Caps"
                    value={element.data.caps}
                    onChange={(caps) => setData({ caps })}
                />
            </ScrollView>
        </BottomSheet>
    )
}

const styles = StyleSheet.create({
    actions: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 8
    },

    scrollActions: {
        flex: 1
    },

    input: {
        margin: 8,
        marginTop: 0
    }
})

export default TextboxElementActions
