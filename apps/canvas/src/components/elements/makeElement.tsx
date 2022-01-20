import React, { useCallback, useEffect, useRef, useState } from "react"
import { DeepPartial } from "tsdef"
import { deepmerge } from "@mui/utils"
import * as CSS from "csstype"
import { Editor, updateElementRect, useSharedContext } from "@meme-bros/shared"
import Interactions from "./Interactions"
import { DraggableCore, DraggableEventHandler } from "react-draggable"
import { AnimatedValue, AnimatedValueXY, useAnimationRegistry } from "../../lib/animation"
import { setListeners } from "../../lib/events"
import { getElementBasePosition } from "./utils"

type DraggableProps = React.ComponentProps<typeof DraggableCore>

export type ElementComponentProps<
    T extends Editor.CanvasElement["type"]
> = {
    element: Editor.PickElement<T>
}

export type ElementProps<T extends Editor.CanvasElement["type"]> = {
    element: Editor.PickElement<T>,
    setDraggableProps: (props: DraggableProps) => void,
    size: AnimatedValueXY,
    rotation: AnimatedValue
}

export type ElementConfig = {
    interactions: Record<"rotate" | "resize" | "edit" | "config" | "delete", boolean>,
    aspectRatio?: number
}

const defaultConfig: ElementConfig = {
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

function makeElement<T extends Editor.CanvasElement["type"]>(
    Component: React.ComponentType<ElementProps<T>>,
    getElementConfig: ({ element }: { element: Editor.PickElement<T> }) =>
        DeepPartial<ElementConfig> = () => ({})
) {
    return ({ element }: ElementComponentProps<T>) => {
        const config = deepmerge(
            defaultConfig,
            getElementConfig({ element })
        ) as ElementConfig
        
        const context = useSharedContext()

        const animations = useAnimationRegistry()

        const pos = animations.useAnimation(
            `element.${element.id}.pos`,
            new AnimatedValueXY(element.rect)
        )
        const size = animations.useAnimation(
            `element.${element.id}.size`,
            new AnimatedValueXY({
                x: element.rect.width,
                y: element.rect.height
            })
        )
        const rotation = animations.useAnimation(
            `element.${element.id}.rotation`,
            new AnimatedValue(element.rect.rotation)
        )

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
            context.events.emit("history.push")
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

        const alignBaseElement = () => {
            if (!context.canvas.base) {
                return
            }
            pos.emit("update", getElementBasePosition(
                context.canvas.base,
                animations.getAnimationXY("canvas.size"),
                size
            ))
        }

        useEffect(() => setListeners(pos, [["update", updateTransform]]))
        useEffect(() => setListeners(size, [["update", updateTransform]]))
        useEffect(() => setListeners(rotation, [["update", updateTransform]]))
        useEffect(() => updateTransform(), [updateTransform])

        useEffect(() => {
            if (context.canvas.base?.id === element.id) {
                return setListeners(
                    animations.getAnimationXY("canvas.size"),
                    [["update", alignBaseElement]]
                )
            }
        })

        useEffect(() => {
            pos.emit("update", {
                x: element.rect.x,
                y: element.rect.y
            })
            size.emit("update", {
                x: element.rect.width,
                y: element.rect.height
            })
            rotation.emit("update", element.rect.rotation)
        }, [element.rect, pos, size, rotation])

        return (
            <DraggableCore
                {...getHandleProps("move", {
                    onStart: focusElement,
                    onStop: updateElement
                })}
                onDrag={handleMovementDrag}
                handle={`#element-${element.id}`}
                {...draggableProps}
                {...(!element.interactive ? { disabled: true } : {})}
            >
                <div ref={container} style={{
                    ...getTransformStyles(),
                    transformOrigin: "center, center",
                    position: "absolute",
                    pointerEvents: !element.interactive ? "none" : "unset"
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
                    {element.interactive && context.interactions.focus === element.id && (
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
