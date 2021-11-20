import React, { useContext, useState } from "react"
import { StyleSheet, View } from "react-native"
import { Element, PickElement } from "./index"
import { EditorContext } from "../Context"
import { IconButton } from "react-native-paper"
import Draggable, { DraggableProps } from "../../../lib/Draggable"

export type ElementProps = {
    setDraggableProps: (props: DraggableProps) => void
}

function makeElement<T extends Element["type"]>(
    Component: React.ComponentType<ElementProps & {
        element: PickElement<T>
    }>
) {
    return ({ element }: ElementProps & { element: PickElement<T> }) => {
        const context = useContext(EditorContext)
        const [draggableProps, setDraggableProps] = useState<DraggableProps>({})

        return (
            <Draggable
                x={element.rect.x}
                y={element.rect.y}
                clamp={[0, 0, context.dimensions.width, context.dimensions.height]}
                {...draggableProps}
            >
                <View
                    style={{
                        width: element.rect.width,
                        height: element.rect.height
                    }}
                >
                    <Component
                        element={element}
                        setDraggableProps={setDraggableProps}
                    />
                    <View style={styles.controls}>
                        <View style={styles.resizeHandles}>
                            <View style={styles.resizeHandleDiagonal}>
                                <IconButton
                                    icon="arrow-top-right-bottom-left"
                                />
                            </View>
                        </View>
                    </View>
                </View>
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
    },

    resizeHandleDiagonal: {
        position: "absolute",
        right: 0,
        bottom: 0,
        transform: [{ translateX: 40 }, { translateY: 40 }, { rotate: "90deg" }]
    }
})

export default makeElement
