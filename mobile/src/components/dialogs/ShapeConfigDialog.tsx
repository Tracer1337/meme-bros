import React, { useState } from "react"
import { StyleSheet, View } from "react-native"
import { Button, Dialog } from "react-native-paper"
import { PickElement } from "../../types"
import { getShapeStyles } from "../editor/elements/Shape"
import { colors, shapeVariants } from "../inputs/items"
import NumberInput from "../inputs/NumberInput"
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
                    label="Shape"
                    style={styles.input}
                    items={shapeVariants}
                    value={data.variant}
                    onChange={(variant) => setData({ ...data, variant })}
                />
                <Select
                    label="Background Color"
                    style={styles.input}
                    items={colors}
                    value={data.backgroundColor}
                    onChange={(backgroundColor) => setData({ ...data, backgroundColor })}
                />
                <Select
                    label="Border Color"
                    style={styles.input}
                    items={colors}
                    value={data.borderColor}
                    onChange={(borderColor) => setData({ ...data, borderColor })}
                />
                <NumberInput
                    label="Border Width"
                    value={data.borderWidth}
                    onChange={(borderWidth) => setData({ ...data, borderWidth })}
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
    },
    
    preview: {
        width: 200,
        height: 100
    }
})

export default ShapeConfigDialog
