import React, { useContext, useEffect, useRef, useState } from "react"
import { Animated, StyleSheet, View } from "react-native"
import { Element, PickElement } from "./index"
import { EditorContext } from "../Context"
import { IconButton } from "react-native-paper"
import Draggable, { DraggableProps } from "../../../lib/Draggable"

export type ElementProps = {
    setDraggableProps: (props: DraggableProps) => void
}

type HandleKey = "move" | "resizeXY"

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
    return ({ element }: ElementProps & { element: PickElement<T> }) => {
        const context = useContext(EditorContext)

        const size = useRef(createSizeObject(element.rect)).current

        const [draggableProps, setDraggableProps] = useState<DraggableProps>({})
        const [activeHandle, setActiveHandle] = useState<HandleKey | null>(null)

        const makeHandleProps = (key: HandleKey): DraggableProps => ({
            onStart: () => setActiveHandle(key),
            onEnd: () => setActiveHandle(null),
            disabled: activeHandle !== null && activeHandle !== key
        })

        return (
            <Draggable
                x={element.rect.x}
                y={element.rect.y}
                clamp={[0, 0, context.dimensions.width, context.dimensions.height]}
                {...makeHandleProps("move")}
                {...draggableProps}
            >
                <Animated.View
                    style={{ width: size.x, height: size.y }}
                >
                    <Component
                        element={element}
                        setDraggableProps={setDraggableProps}
                    />
                    <View style={styles.controls}>
                        <View style={styles.resizeHandles}>
                            <View style={{
                                position: "absolute",
                                right: 0,
                                bottom: 0,
                                borderWidth: 3,
                                borderColor: "white"
                            }}>
                                <Draggable
                                    style={{
                                        borderWidth: 3,
                                        borderColor: "black"
                                    }}
                                    controlled
                                    onDrag={Animated.event(
                                        [{ x: size.x, y: size.y }],
                                        { useNativeDriver: false }
                                    )}
                                    {...makeHandleProps("resizeXY")}
                                >
                                    <IconButton
                                        style={{
                                            transform: [{ rotate: "90deg" }]
                                        }}
                                        icon="arrow-top-right-bottom-left"
                                    />
                                </Draggable>
                            </View>
                        </View>
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

    resizeHandles: {
        width: "100%",
        height: "100%",
        borderColor: "white",
        borderWidth: 3,
        position: "relative"
    }
})

export default makeElement
