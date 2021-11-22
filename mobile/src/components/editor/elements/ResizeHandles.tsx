import React from "react"
import { Animated, StyleSheet, View } from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { DraggableProps } from "../../../lib/Draggable"
import Handle from "../../styled/Handle"
import type { HandleKey } from "./makeElement"

function ResizeHandles({ animate, getHandleProps }: {
    animate: Animated.ValueXY,
    getHandleProps: (key: HandleKey) => DraggableProps
}) {
    return (
        <View style={styles.resizeHandles}>
            <View style={styles.resizeXY}>
                <Handle
                    controlled
                    onDrag={Animated.event(
                        [{ x: animate.x, y: animate.y }],
                        { useNativeDriver: false }
                    )}
                    {...getHandleProps("resize")}
                >
                    <Icon
                        name="arrow-top-right-bottom-left"
                        size={24}
                        style={{ transform: [{ rotate: "90deg" }] }}
                        color="#000"
                    />
                </Handle>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    resizeHandles: {
        width: "100%",
        height: "100%",
        position: "relative"
    },

    resizeXY: {
        position: "absolute",
        right: 14,
        bottom: 14
    }
})

export default ResizeHandles
