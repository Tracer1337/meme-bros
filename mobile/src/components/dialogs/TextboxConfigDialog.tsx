import React, { useState } from "react"
import { View } from "react-native"
import { Button, Dialog, Switch, Text } from "react-native-paper"
import Select, { Item } from "react-native-picker-select"
import { PickElement } from "../../types"
import { getTextStyles, getTransformedText } from "../editor/elements/Textbox"

const fontFamilies: Item[] = [
    { label: "Impact", value: "Impact_normal" },
    { label: "Arial", value: "Arial_normal" }
]

const colors: Item[] = [
    { label: "White", value: "#ffffff" },
    { label: "Black", value: "#000000" },
    { label: "Green", value: "#2ecc71" },
    { label: "Red", value: "#e74c3c" },
    { label: "Blue", value: "#3498db" },
    { label: "Yellow", value: "#f1c40f" },
    { label: "Purple", value: "#9b59b6" }
]

function TextboxConfigDialog({ visible, data: element, close }: {
    visible: boolean,
    data: PickElement<"textbox">,
    close: (data: PickElement<"textbox">["data"]) => void
}) {
    const [data, setData] = useState(element.data)

    const required = (setValue: (value: any) => void) => {
        return (value: any) => {
            if (value !== null && value !== undefined) {
                setValue(value)
            }
        }
    }

    const textStyles = getTextStyles({ ...element, data })

    return (
        <Dialog visible={visible} onDismiss={() => close(element.data)}>
            <Dialog.Title style={textStyles}>
                {getTransformedText({ ...element, data })}
            </Dialog.Title>
            <Dialog.Content>
                <Select
                    placeholder={{ label: "Color", value: null }}
                    value={data.color}
                    items={colors}
                    onValueChange={required((value) => setData({
                        ...data,
                        color: value
                    }))}
                />
                <Select
                    placeholder={{ label: "Font Family", value: null }}
                    value={data.fontFamily}
                    items={fontFamilies}
                    onValueChange={required((value) => setData({
                        ...data,
                        fontFamily: value
                    }))}
                />
                <View>
                    <Text>Caps</Text>
                    <Switch
                        value={data.caps}
                        onValueChange={(value) => setData({
                            ...data,
                            caps: value
                        })}
                    />
                </View>
            </Dialog.Content>
            <Dialog.Actions>
                <Button onPress={() => close(data)} style={{ width: "100%" }}>
                    Apply
                </Button>
            </Dialog.Actions>
        </Dialog>
    )
}

export default TextboxConfigDialog
