import React, { useState } from "react"
import { Button, Dialog } from "react-native-paper"
import Select, { Item } from "react-native-picker-select"
import { PickElement } from "../editor/elements"
import { getTextStyles } from "../editor/elements/Textbox"

const fontFamilies: Item[] = [
    { label: "Impact", value: "Impact" },
    { label: "Arial", value: "Arial" }
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

function TextboxConfigDialog({ data: element, close }: {
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
        <Dialog visible={true} onDismiss={() => close(element.data)}>
            <Dialog.Title style={textStyles}>{element.data.text}</Dialog.Title>
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
