import React, { useContext, useEffect, useMemo, useRef, useState } from "react"
import { Animated } from "react-native"
import { DeepPartial } from "tsdef"
import deepmerge from "deepmerge"
import Draggable, { DraggableProps } from "../../../lib/Draggable"
import { EditorContext } from "../Context"
import { withOffset } from "../../../lib/animated"
import useLayout from "../../../lib/useLayout"
import { CanvasElement, PickElement } from "../../../types"
import Interactions from "./Interactions"

export type ElementProps<T extends CanvasElement["type"]> = {
    element: PickElement<T>,
    setDraggableProps: (props: DraggableProps) => void,
    size: Animated.ValueXY,
    rotation: Animated.Value
}

export type ElementConfig = {
    focusable: boolean,
    interactions: Record<"rotate" | "resize" | "edit" | "config" | "delete", boolean>
}

const defaultConfig: ElementConfig = {
    focusable: true,
    interactions: {
        rotate: true,
        resize: true,
        edit: true,
        config: true,
        delete: true
    }
}

export type HandleKey = "move" | "resize" | "rotate"

export type GetHandleProps = (key: HandleKey, options?: {
    onStart?: () => void,
    onEnd?: () => void
}) => void

function makeElement<T extends CanvasElement["type"]>(
    Component: React.ComponentType<ElementProps<T>>,
    getElementConfig: ({ element }: { element: PickElement<T> }) =>
        DeepPartial<ElementConfig> = () => ({})
) { 
    return ({ element }: { element: PickElement<T> }) => {
        const context = useContext(EditorContext)

        const config = useMemo(
            () => deepmerge(defaultConfig, getElementConfig({ element })) as ElementConfig,
            [element]
        )

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

        const updateElement = () => {
            const layout = getLayout()
            if (!layout) {
                return
            }
            element.rect = {
                x: layout.x,
                y: layout.y,
                width: layout.width,
                height: layout.height,
                // @ts-ignore
                rotation: rotation._value
            }
            context.set({})
        }

        const focusElement = () => {
            context.set({ interactions: { focus: element.id } })
        }

        const blurElement = () => {
            updateElement()
        }

        return (
            <Draggable
                x={element.rect.x}
                y={element.rect.y}
                onLayout={onLayout}
                {...getHandleProps("move", {
                    onStart: focusElement,
                    onEnd: blurElement
                })}
                {...draggableProps}
                {...(!config.focusable ? { disabled: true } : {})}
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
                        size={size}
                        rotation={rotation}
                    />
                    {config.focusable && (
                        <Interactions
                            active={context.interactions.focus === element.id}
                            element={element}
                            config={config}
                            size={size}
                            rotation={rotation}
                            onUpdate={updateElement}
                            getHandleProps={getHandleProps}
                        />
                    )}
                </Animated.View>
            </Draggable>
        )
    }
}

export default makeElement
