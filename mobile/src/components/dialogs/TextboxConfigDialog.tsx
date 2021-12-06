import React, { useState } from "react"
import { View } from "react-native"
import { Button, Dialog, Switch, Text } from "react-native-paper"
import Select, { Item } from "react-native-picker-select"
import { fromHex, toHex } from "../../lib/color"
import { required } from "../../lib/validation"
import { PickElement } from "../../types"
import { getTextStyles, getTransformedText } from "../editor/elements/Textbox"
import ColorPicker from "../inputs/ColorPicker"

const fontFamilies: Item[] = [
    { label: "Impact", value: "Impact" },
    { label: "Arial", value: "Arial" },
    { label: "Comic Sans", value: "Comic-Sans" }
]

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
                <ColorPicker
                    label="Color"
                    value={toHex(data.color)}
                    onChange={required((value) => setData({
                        ...data,
                        color: fromHex(value)
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
