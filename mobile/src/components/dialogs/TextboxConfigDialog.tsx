import React, { useState } from "react"
import { StyleSheet } from "react-native"
import { Button, Dialog } from "react-native-paper"
import { PickElement } from "../../types"
import { getTextStyles, getTransformedText } from "../editor/elements/Textbox"
import BooleanInput from "../inputs/BooleanInput"
import { colors, fontFamilies, fontWeights } from "../inputs/items"
import NumberInput from "../inputs/NumberInput"
import Select from "../inputs/Select"

function TextboxConfigDialog({ visible, data: element, close }: {
    visible: boolean,
    data: PickElement<"textbox">,
    close: (data: PickElement<"textbox">["data"]) => void
}) {
    const [data, setData] = useState(element.data)

    const textStyles = getTextStyles({ ...element, data })

    return (
        <Dialog visible={visible} onDismiss={() => close(element.data)}>
            <Dialog.Title style={textStyles}>
                {getTransformedText({ ...element, data })}
            </Dialog.Title>
            <Dialog.Content>
                <Select
                    label="Color"
                    style={styles.input}
                    items={colors}
                    value={data.color}
                    onChange={(color) => setData({ ...data, color })}
                />
                <Select
                    label="Font Family"
                    style={styles.input}
                    value={data.fontFamily}
                    items={fontFamilies}
                    onChange={(fontFamily) => setData({ ...data, fontFamily })}
                />
                <Select
                    label="Font Weight"
                    style={styles.input}
                    value={data.fontWeight}
                    items={fontWeights}
                    onChange={(fontWeight) => setData({ ...data, fontWeight })}
                />
                <NumberInput
                    label="Outline Width"
                    style={styles.input}
                    value={data.outlineWidth}
                    onChange={(outlineWidth) => setData({ ...data, outlineWidth })}
                />
                <Select
                    label="Outline Color"
                    style={styles.input}
                    value={data.outlineColor}
                    items={colors}
                    onChange={(outlineColor) => setData({ ...data, outlineColor })}
                />
                <Select
                    label="Background Color"
                    style={styles.input}
                    value={data.backgroundColor}
                    items={colors}
                    onChange={(backgroundColor) => setData({ ...data, backgroundColor })}
                />
                <BooleanInput
                    label="Caps"
                    value={data.caps}
                    onChange={(caps) => setData({ ...data, caps })}
                />
            </Dialog.Content>
            <Dialog.Actions>
                <Button onPress={() => close(data)} style={{ width: "100%" }}>
                    Apply
                </Button>
            </Dialog.Actions>
        </Dialog>
    )
}

const styles = StyleSheet.create({
    input: {
        marginBottom: 16
    }
})

export default TextboxConfigDialog
