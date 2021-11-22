import React, { useContext, useRef, useState } from "react"
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import Draggable, { DraggableProps } from "../../../lib/Draggable"
import { Element, ElementTypes, PickElement } from "./index"
import { EditorContext, ElementEvents } from "../Context"
import ResizeHandles from "./ResizeHandles"
import RotationHandle from "./RotationHandle"
import { withOffset } from "../../../lib/animated"
import useLayout from "../../../lib/useLayout"
import globalStyles from "../../../styles"

export type ElementProps = {
    setDraggableProps: (props: DraggableProps) => void
}

export type HandleKey = "move" | "resize" | "rotate"

export type GetHandleProps = (key: HandleKey, options?: {
    onStart?: () => void,
    onEnd?: () => void
}) => void

function ActionHandle({ icon, onPress }: {
    icon: string,
    onPress: () => void
}) {
    return (
        <TouchableOpacity onPress={onPress}>
            <Icon
                name={icon}
                size={24}
                color="#000"
                style={globalStyles.handle}
            />
        </TouchableOpacity>
    )
}

function makeElement<T extends Element["type"]>(
    Component: React.ComponentType<ElementProps & {
        element: PickElement<T>
    }>
) {
    return ({ element }: Omit<ElementProps, "setDraggableProps"> & { element: PickElement<T> }) => {
        const context = useContext(EditorContext)

        const [getLayout, onLayout] = useLayout()

        const size = useRef(withOffset(new Animated.ValueXY(), {
            x: element.rect.width,
            y: element.rect.height
        })).current
        const rotation = useRef(new Animated.Value(element.rect.rotation)).current

        const [draggableProps, setDraggableProps] = useState<DraggableProps>({})
        const [activeHandle, setActiveHandle] = useState<HandleKey | null>(null)

        const getHandleProps: GetHandleProps = (key, options) => ({
            onStart: () => {
                setActiveHandle(key)
                options?.onStart?.()
            },
            onEnd: () => {
                setActiveHandle(null)
                options?.onEnd?.()
            },
            disabled: activeHandle !== null && activeHandle !== key
        })

        const event = (name: ElementEvents) => () => {
            context.events.emit(`element.${name}`, element.id)
        }

        const updateElement = () => {
            const layout = getLayout()
            if (!layout) {
                return
            }
            element.rect = {
                ...element.rect,
                x: layout.x,
                y: layout.y,
                width: layout.width,
                height: layout.height,
                // @ts-ignore
                rotation: rotation._value
            }
            context.set({})
        }

        return (
            <Draggable
                x={element.rect.x}
                y={element.rect.y}
                clamp={[0, 0, context.dimensions.width, context.dimensions.height]}
                onLayout={onLayout}
                {...getHandleProps("move", { onEnd: updateElement })}
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
                            <View style={{ marginRight: 8 }}>
                                <RotationHandle
                                    animate={rotation}
                                    childRect={element.rect}
                                    onUpdate={updateElement}
                                    getHandleProps={getHandleProps}
                                />
                            </View>
                            <ActionHandle icon="pencil" onPress={event("edit")}/>
                        </View>
                        <ResizeHandles
                            animate={size}
                            getHandleProps={getHandleProps}
                            onUpdate={updateElement}
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
        flexDirection: "row",
        justifyContent: "center"
    }
})

export default makeElement
