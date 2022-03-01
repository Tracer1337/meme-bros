import React, { useRef } from "react"
import { StyleSheet, View } from "react-native"
import { Surface, TextInput, useTheme } from "react-native-paper"
import BottomSheet from "@gorhom/bottom-sheet"
import { ScrollView } from "react-native-gesture-handler"
import {
    colors,
    textAlign,
    verticalAlign,
    fontFamilies,
    fontWeights
} from "@meme-bros/client-lib"
import CommonElementActions from "./CommonElementActions"
import Select from "../../inputs/Select"
import NumberInput from "../../inputs/NumberInput"
import Switch from "../../inputs/Switch"
import { useTextboxElementActions } from "../utils/actions"
import { useFocusedElement } from "../utils/canvas"

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
                <Select
                    style={styles.input}
                    items={colors}
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
                <Select
                    style={styles.input}
                    items={colors}
                    label="Outline Color"
                    value={element.data.outlineColor}
                    onChange={(outlineColor) => setData({ outlineColor })}
                />
                <Select
                    style={styles.input}
                    items={textAlign}
                    label="Text Align"
                    value={element.data.textAlign}
                    onChange={(textAlign) => setData({ textAlign })}
                />
                <Select
                    style={styles.input}
                    items={verticalAlign}
                    label="Vertical Align"
                    value={element.data.verticalAlign}
                    onChange={(verticalAlign) => setData({ verticalAlign })}
                />
                <Select
                    style={styles.input}
                    items={fontFamilies}
                    label="Font Family"
                    value={element.data.fontFamily}
                    onChange={(fontFamily) => setData({ fontFamily })}
                />
                <Select
                    style={styles.input}
                    items={fontWeights}
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
