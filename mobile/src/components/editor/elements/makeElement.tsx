import React, { useContext, useRef, useState } from "react"
import { Animated, StyleSheet, View } from "react-native"
import Draggable, { DraggableProps } from "../../../lib/Draggable"
import { Element, PickElement } from "./index"
import { EditorContext } from "../Context"
import ResizeHandles from "./ResizeHandles"
import RotationHandle from "./RotationHandle"

export type ElementProps = {
    setDraggableProps: (props: DraggableProps) => void
}

export type HandleKey = "move" | "resize" | "rotate"

function createSizeObject(rect: Element["rect"]) {
    const size = new Animated.ValueXY()
    size.setOffset({ x: rect.width, y: rect.height })
    return size
}

function makeElement<T extends Element["type"]>(
    Component: React.ComponentType<ElementProps & {
        element: PickElement<T>
    }>
) {
    return ({ element }: Omit<ElementProps, "setDraggableProps"> & { element: PickElement<T> }) => {
        const context = useContext(EditorContext)

        const size = useRef(createSizeObject(element.rect)).current
        const rotation = useRef(new Animated.Value(element.rect.rotation)).current

        const [draggableProps, setDraggableProps] = useState<DraggableProps>({})
        const [activeHandle, setActiveHandle] = useState<HandleKey | null>(null)

        const getHandleProps = (key: HandleKey): DraggableProps => ({
            onStart: () => setActiveHandle(key),
            onEnd: () => setActiveHandle(null),
            disabled: activeHandle !== null && activeHandle !== key
        })

        return (
            <Draggable
                x={element.rect.x}
                y={element.rect.y}
                clamp={[0, 0, context.dimensions.width, context.dimensions.height]}
                {...getHandleProps("move")}
                {...draggableProps}
            >
                <Animated.View
                    style={{
                        width: size.x,
                        height: size.y,
                        transform: [{
                            rotate: rotation.interpolate({
                                inputRange: [0, 2*Math.PI],
                                outputRange: ["0deg", "360deg"]
                            })
                        }]
                    }}
                >
                    <Component
                        element={element}
                        setDraggableProps={setDraggableProps}
                    />
                    <View style={styles.controls}>
                        <View style={styles.topControls}>
                            <RotationHandle
                                animate={rotation}
                                childRect={element.rect}
                                getHandleProps={getHandleProps}
                            />
                        </View>
                        <ResizeHandles
                            animate={size}
                            getHandleProps={getHandleProps}
                        />
                    </View>
                </Animated.View>
            </Draggable>
        )
    }
}

const styles = StyleSheet.create({
    controls: {
        width: "100%",
        height: "100%",
        position: "absolute"
    },

    topControls: {
        position: "absolute",
        top: -24,
        width: "100%",
        flex: 1,
        alignItems: "center"
    }
})

export default makeElement
