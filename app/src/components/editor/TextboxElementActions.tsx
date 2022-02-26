import React, { useRef } from "react"
import { StyleSheet, View } from "react-native"
import { Surface, TextInput, useTheme } from "react-native-paper"
import BottomSheet from "@gorhom/bottom-sheet"
import { ScrollView } from "react-native-gesture-handler"
import { Editor } from "@meme-bros/shared"
import {
    updateElementData,
    useSharedContext,
    colors,
    textAlign,
    verticalAlign,
    fontFamilies,
    fontWeights
} from "@meme-bros/client-lib"
import { useActions } from "./utils/actions"
import CommonElementActions from "./CommonElementActions"
import Select from "../inputs/Select"
import NumberInput from "../inputs/NumberInput"
import Switch from "../inputs/Switch"

function TextboxElementActions() {
    const context = useSharedContext()

    const element = context.canvas.elements[
        context.focus || -1
    ] as Editor.PickElement<"textbox">

    const theme = useTheme()

    const bottomSheetRef = useRef<BottomSheet>(null)

    const { action } = useActions({ bottomSheetRef })

    const setData = (
        data: Partial<Editor.PickElement<"textbox">["data"]>
    ) => {
        context.set(updateElementData(context, element, data))
    }

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
                <CommonElementActions action={action}/>
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
        flex: 1,
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
