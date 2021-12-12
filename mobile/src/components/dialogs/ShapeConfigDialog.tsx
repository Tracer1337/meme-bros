import React, { useState } from "react"
import { StyleSheet, View } from "react-native"
import { Button, Dialog } from "react-native-paper"
import { PickElement } from "../../types"
import { getShapeStyles } from "../editor/elements/Shape"
import { colors } from "../inputs/items"
import Select from "../inputs/Select"

function ShapeConfigDialog({ visible, data: element, close }: {
    visible: boolean,
    data: PickElement<"shape">,
    close: (data: PickElement<"shape">["data"]) => void
}) {
    const [data, setData] = useState(element.data)

    const shapeStyles = getShapeStyles({ ...element, data })

    return (
        <Dialog visible={visible} onDismiss={() => close(element.data)}>
            <Dialog.Title>
                <View style={[shapeStyles, styles.preview]} />
            </Dialog.Title>
            <Dialog.Content>
                <Select
                    label="Background Color"
                    items={colors}
                    value={data.backgroundColor}
                    onChange={(value) => setData({
                        ...data,
                        backgroundColor: value
                    })}
                />
                <Select
                    label="Border Color"
                    items={colors}
                    value={data.borderColor}
                    onChange={(value) => setData({
                        ...data,
                        borderColor: value
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

const styles = StyleSheet.create({
    preview: {
        width: 200,
        height: 100
    }
})

export default ShapeConfigDialog
