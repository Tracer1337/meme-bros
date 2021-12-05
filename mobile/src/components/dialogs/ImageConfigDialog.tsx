import React, { useState } from "react"
import { Button, Dialog, TextInput } from "react-native-paper"
import { PickElement } from "../../types"

function ImageConfigDialog({ visible, data: element, close }: {
    visible: boolean,
    data: PickElement<"image">,
    close: (data: PickElement<"image">["data"]) => void
}) {
    const [data, setData] = useState(element.data)

    return (
        <Dialog visible={visible}>
            <Dialog.Content>
                <TextInput
                    label="Border Radius"
                    keyboardType="numeric"
                    mode="outlined"
                    value={data.borderRadius.toString()}
                    onChangeText={(value) => setData({
                        ...data,
                        borderRadius: parseInt(value) || 0
                    })}
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
export default ImageConfigDialog
