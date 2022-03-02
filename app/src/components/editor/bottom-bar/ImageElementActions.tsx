import React, { useRef } from "react"
import { StyleSheet, View } from "react-native"
import { Surface, useTheme } from "react-native-paper"
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet"
import CommonElementActions from "./CommonElementActions"
import NumberInput from "../../inputs/NumberInput"
import Switch from "../../inputs/Switch"
import { useImageElementActions } from "../utils/actions"
import { useFocusedElement } from "../utils/canvas"

function ImageElementActions() {
    const theme = useTheme()
    
    const bottomSheetRef = useRef<BottomSheet>(null)
    
    const { setData } = useImageElementActions()
    
    const element = useFocusedElement<"image">()

    if (!element || element.type !== "image") {
        return <></>
    }

    return (
        <BottomSheet
            ref={bottomSheetRef}
            snapPoints={[130, 210]}
            backgroundComponent={Surface}
            handleIndicatorStyle={{
                backgroundColor: theme.colors.onSurface
            }}
        >
            <Switch
                style={styles.input}
                label="Keep Aspect Ratio"
                value={element.data.keepAspectRatio}
                onChange={(keepAspectRatio) => setData({ keepAspectRatio })}
            />
            <View style={styles.actions}>
                <CommonElementActions bottomSheet={bottomSheetRef}/>
            </View>
            <BottomSheetView style={{ flex: 1 }}>
                <NumberInput
                    style={styles.input}
                    label="Border Radius"
                    mode="outlined"
                    value={element.data.borderRadius}
                    onChange={(borderRadius) => setData({ borderRadius })}
                />
            </BottomSheetView>
        </BottomSheet>
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
