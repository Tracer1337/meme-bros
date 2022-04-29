import { StyleSheet, View } from "react-native"
import CommonElementActions from "./CommonElementActions"
import NumberInput from "../../inputs/NumberInput"
import Switch from "../../inputs/Switch"
import { useImageElementActions } from "../utils/actions"
import { useFocusedElement } from "../utils/canvas"

function ImageElementActions() {
    const { setData } = useImageElementActions()

    const element = useFocusedElement<"image">()

    if (!element || element.type !== "image") {
        return <></>
    }

    return (
        <>
            <View style={styles.actions}>
                <CommonElementActions/>
            </View>
            <NumberInput
                style={styles.input}
                label="Border Radius"
                mode="outlined"
                value={element.data.borderRadius}
                onChange={(borderRadius) => setData({ borderRadius })}
            />
            <Switch
                style={styles.input}
                label="Keep Aspect Ratio"
                value={element.data.keepAspectRatio}
                onChange={(keepAspectRatio) => setData({ keepAspectRatio })}
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

export default ImageElementActions
