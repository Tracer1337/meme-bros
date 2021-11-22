import React from "react"
import { Animated, StyleSheet } from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import Draggable, { DraggableProps } from "../../../lib/Draggable"
import { HandleKey } from "./makeElement"

function RotationHandle({ animate, childRect, getHandleProps }: {
    animate: Animated.Value,
    childRect: { width: number, height: number },
    getHandleProps: (key: HandleKey) => DraggableProps
}) {
    const getRotationAngle = (pos: { x: number, y: number }) => {
        const childCenter = { x: childRect.width / 2, y: childRect.height / 2 }
        pos.x += childCenter.x
        pos.y -= 12
        return Math.atan2(childCenter.y - pos.y, childCenter.x - pos.x) - Math.PI / 2
    }

    const handleRotationDrag = (pos: { x: number, y: number }) => {
        animate.setValue(getRotationAngle(pos))
    }

    return (
        <Draggable
            style={styles.handle}
            controlled
            onDrag={handleRotationDrag}
            {...getHandleProps("rotate")}
        >
            <Icon name="rotate-left" size={24} color="#000"/>
        </Draggable>
    )
}
const styles = StyleSheet.create({
    handle: {
        backgroundColor: "#fff",
        borderColor: "#000",
        borderWidth: 1,
        borderRadius: 4,
        position: "relative"
    }
})

export default RotationHandle
