import React from "react"
import { Animated } from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { DraggableProps } from "../../../lib/Draggable"
import Handle from "../../styled/Handle"
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
        <Handle controlled onDrag={handleRotationDrag} {...getHandleProps("rotate")}>
            <Icon name="rotate-left" size={24} color="#000"/>
        </Handle>
    )
}

export default RotationHandle
