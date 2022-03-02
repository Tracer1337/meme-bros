import React from "react"
import { StyleSheet, View } from "react-native"
import { TextInput } from "react-native-paper"
import {
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
import ColorSelect from "../../inputs/ColorSelect"

function TextboxElementActions() {
    const { setData } = useTextboxElementActions()

    const element = useFocusedElement<"textbox">()

    if (!element || element.type !== "textbox") {
        return <></>
    }

    return (
        <>
            <View style={styles.actions}>
                <CommonElementActions/>
            </View>
            <TextInput
                style={styles.input}
                label="Text"
                mode="outlined"
                value={element.data.text}
                onChangeText={(text: string) => setData({ text })}
            />
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

export default TextboxElementActions
