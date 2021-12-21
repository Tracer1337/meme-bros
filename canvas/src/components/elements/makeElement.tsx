import React, { useCallback, useContext, useEffect, useRef, useState } from "react"
import { DeepPartial } from "tsdef"
import { deepmerge } from "@mui/utils"
import * as CSS from "csstype"
import { CanvasContext, updateElementRect } from "../Context"
import { CanvasElement, PickElement } from "../../types"
import Interactions from "./Interactions"
import { DraggableCore, DraggableEventHandler } from "react-draggable"
import { AnimatedValue, AnimatedValueXY } from "../../lib/animation"
import { setDOMListeners, setListeners } from "../../lib/events"

type DraggableProps = React.ComponentProps<typeof DraggableCore>

export type ElementProps<T extends CanvasElement["type"]> = {
    element: PickElement<T>,
    setDraggableProps: (props: DraggableProps) => void,
    size: AnimatedValueXY,
    rotation: AnimatedValue
}

export type ElementConfig = {
    focusable: boolean,
    interactions: Record<"rotate" | "resize" | "edit" | "config" | "delete", boolean>,
    aspectRatio?: number
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
    onStart?: DraggableEventHandler,
    onStop?: DraggableEventHandler
}) => void

function makeElement<T extends CanvasElement["type"]>(
    Component: React.ComponentType<ElementProps<T>>,
    getElementConfig: ({ element }: { element: PickElement<T> }) =>
        DeepPartial<ElementConfig> = () => ({})
) { 
    return ({ element }: { element: PickElement<T> }) => {
        const context = useContext(CanvasContext)

        const config = deepmerge(defaultConfig, getElementConfig({ element })) as ElementConfig

        const pos = useRef(new AnimatedValueXY(element.rect)).current
        const size = useRef(new AnimatedValueXY({
            x: element.rect.width,
            y: element.rect.height
        })).current
        const rotation = useRef(new AnimatedValue(element.rect.rotation)).current
        const container = useRef<HTMLDivElement>(null)

        const [draggableProps, setDraggableProps] = useState<DraggableProps>({})
        const [activeHandle, setActiveHandle] = useState<HandleKey | null>(null)

        const getHandleProps: GetHandleProps = (key, options) => ({
            onStart: (...args: Parameters<DraggableEventHandler>) => {
                setActiveHandle(key)
                options?.onStart?.(...args)
            },
            onStop: (...args: Parameters<DraggableEventHandler>) => {
                setActiveHandle(null)
                options?.onStop?.(...args)
            },
            disabled: activeHandle !== null && activeHandle !== key
        })

        const updateElement = () => {
            context.set(updateElementRect(context, element, {
                x: pos.x.value,
                y: pos.y.value,
                width: size.x.value,
                height: size.y.value,
                rotation: rotation.value
            }))
        }

        const focusElement = () => {
            context.set({ interactions: { focus: element.id } })
        }

        const blurElement = () => {
            if (context.interactions.focus === element.id) {
                context.set({ interactions: { focus: null } })
            }
        }

        const handleMovementDrag: DraggableEventHandler = (_, { deltaX, deltaY }) => {
            pos.emit("update", {
                x: pos.x.value + deltaX,
                y: pos.y.value + deltaY
            })
        }

        const getTransformStyles = useCallback((): CSS.Properties => {
            return {
                transform: `
                    translate(${pos.x.value}px, ${pos.y.value}px)
                    rotate(${rotation.value}rad)
                `,
                width: size.x.value + "px",
                height: size.y.value + "px"
            }
        }, [pos, size, rotation])

        const updateTransform = useCallback(() => {
            if (!container.current) {
                return
            }
            Object.assign(container.current.style, getTransformStyles())
        }, [container, getTransformStyles])

        useEffect(() => setListeners(pos, [["update", updateTransform]]))
        useEffect(() => setListeners(size, [["update", updateTransform]]))
        useEffect(() => setListeners(rotation, [["update", updateTransform]]))
        useEffect(() => updateTransform(), [updateTransform])

        useEffect(() => {
            const handleClick = (event: TouchEvent) => {
                if (!container.current?.contains(event.target as Node)) {
                    blurElement()
                }
            }
            return setDOMListeners(window, [
                ["click", handleClick],
                ["touchstart", handleClick]
            ])
        })

        useEffect(() => {
            pos.emit("update", {
                x: element.rect.x,
                y: element.rect.y
            })
        }, [element.rect, pos])

        return (
            <DraggableCore
                {...getHandleProps("move", {
                    onStart: focusElement,
                    onStop: updateElement
                })}
                onDrag={handleMovementDrag}
                handle={`#element-${element.id}`}
                {...draggableProps}
                {...(!config.focusable ? { disabled: true } : {})}
            >
                <div ref={container} style={{
                    ...getTransformStyles(),
                    transformOrigin: "center, center",
                    position: "absolute"
                }}>
                    <div
                        id={`element-${element.id}`}
                        style={{
                            width: "100%",
                            height: "100%",
                            cursor: "move"
                        }}
                    >
                        <Component
                            element={element}
                            setDraggableProps={setDraggableProps}
                            size={size}
                            rotation={rotation}
                        />
                    </div>
                    {config.focusable && context.interactions.focus === element.id && (
                        <Interactions
                            element={element}
                            config={config}
                            onUpdate={updateElement}
                            getHandleProps={getHandleProps}
                            size={size}
                            rotation={rotation}
                        />
                    )}
                </div>
            </DraggableCore>
        )
    }
}

export default makeElement
