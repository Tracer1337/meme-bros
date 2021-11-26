import React, { useState } from "react"
import { Button, Dialog } from "react-native-paper"
import Select from "react-native-picker-select"
import { PickElement } from "../editor/elements"
import { getTextStyles } from "../editor/elements/Textbox"

const fontFamilies: { label: string, value: string }[] = [
    { label: "Impact", value: "Impact" },
    { label: "Arial", value: "Arial" }
]

function TextboxConfigDialog({ data: element, close }: {
    data: PickElement<"textbox">,
    close: (data: PickElement<"textbox">["data"]) => void
}) {
    const [data, setData] = useState(element.data)

    const handleClose = () => {
        close(data)
    }

    const required = (setValue: (value: any) => void) => {
        return (value: any) => {
            if (value !== null && value !== undefined) {
                setValue(value)
            }
        }
    }

    const textStyles = getTextStyles({ ...element, data })

    return (
        <Dialog visible={true} onDismiss={handleClose}>
            <Dialog.Title style={textStyles}>{element.data.text}</Dialog.Title>
            <Dialog.Content>
                <Select
                    onValueChange={required((value) => setData({
                        ...data,
                        fontFamily: value
                    }))}
                    value={data.fontFamily}
                    items={fontFamilies}
                />
            </Dialog.Content>
            <Dialog.Actions>
                <Button onPress={handleClose} style={{ width: "100%" }}>
                    Apply
                </Button>
            </Dialog.Actions>
        </Dialog>
    )
}

export default TextboxConfigDialog
