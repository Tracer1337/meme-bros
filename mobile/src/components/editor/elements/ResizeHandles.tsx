import React, { Children } from "react"
import { Animated, StyleSheet, View } from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import Draggable from "../../../lib/Draggable"
import globalStyles from "../../../styles"
import type { GetHandleProps } from "./makeElement"

function ResizeHandles({
    animate,
    getHandleProps,
    onUpdate,
    childRect,
    aspectRatio
}: {
    animate: Animated.ValueXY,
    getHandleProps: GetHandleProps,
    onUpdate: () => void,
    childRect: { width: number, height: number },
    aspectRatio?: number
}) {
    const handleDrag = ({ x, y }: { x: number, y: number }) => {
        if (aspectRatio) {
            const newX = childRect.width + x
            const newY = newX * aspectRatio
            animate.setValue({
                x: newX - childRect.width,
                y: newY - childRect.height
            })
        } else {
            animate.setValue({ x, y })
        }
    }

    return (
        <View style={styles.resizeHandles}>
            <View style={styles.resizeXY}>
                <Draggable
                    style={globalStyles.handle}
                    controlled
                    onDrag={handleDrag}
                    {...getHandleProps("resize", { onEnd: onUpdate })}
                >
                    <Icon
                        name="arrow-top-right-bottom-left"
                        size={24}
                        style={{ transform: [{ rotate: "90deg" }] }}
                        color="#000"
                    />
                </Draggable>
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
