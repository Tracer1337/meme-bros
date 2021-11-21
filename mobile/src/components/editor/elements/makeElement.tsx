import React, { useContext, useRef, useState } from "react"
import { Animated, StyleSheet, View } from "react-native"
import Draggable, { DraggableProps } from "../../../lib/Draggable"
import { Element, PickElement } from "./index"
import { EditorContext } from "../Context"
import ResizeHandles from "./ResizeHandles"

export type ElementProps = {
    setDraggableProps: (props: DraggableProps) => void
}

export type HandleKey = "move" | "resizeXY"

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
                    style={{ width: size.x, height: size.y }}
                >
                    <Component
                        element={element}
                        setDraggableProps={setDraggableProps}
                    />
                    <View style={styles.controls}>
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
    }
})

export default makeElement
