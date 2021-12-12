import React, { useState } from "react"
import { StyleSheet } from "react-native"
import { Button, Dialog } from "react-native-paper"
import { PickElement } from "../../types"
import BooleanInput from "../inputs/BooleanInput"
import NumberInput from "../inputs/NumberInput"

function ImageConfigDialog({ visible, data: element, close }: {
    visible: boolean,
    data: PickElement<"image">,
    close: (data: PickElement<"image">["data"]) => void
}) {
    const [data, setData] = useState(element.data)

    return (
        <Dialog visible={visible} onDismiss={() => close(element.data)}>
            <Dialog.Content>
                <NumberInput
                    label="Border Radius"
                    style={styles.input}
                    mode="outlined"
                    value={data.borderRadius}
                    onChange={(borderRadius) => setData({ ...data, borderRadius })}
                />
                <BooleanInput
                    label="Keep Aspect Ratio"
                    value={data.keepAspectRatio}
                    onChange={(keepAspectRatio) => setData({ ...data, keepAspectRatio })}
                />
                {data.animated && (
                    <BooleanInput
                        label="Loop"
                        value={data.loop}
                        onChange={(loop) => setData({ ...data, loop })}
                    />
                )}
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

export default ImageConfigDialog
