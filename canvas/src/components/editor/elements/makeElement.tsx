import React, { useCallback, useContext, useEffect, useRef, useState } from "react"
import { DeepPartial } from "tsdef"
import deepmerge from "deepmerge"
import { EditorContext } from "../Context"
import { CanvasElement, PickElement } from "../../../types"
import Interactions from "./Interactions"
import { DraggableCore, DraggableEventHandler } from "react-draggable"
import { AnimatedValue, AnimatedValueXY } from "../../../lib/animation"
import { setDOMListeners, setListeners } from "../../../lib/events"

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
            // const layout = getLayout()
            // if (!layout) {
            //     return
            // }
            // element.rect = {
            //     x: layout.x,
            //     y: layout.y,
            //     width: layout.width,
            //     height: layout.height,
            //     // @ts-ignore
            //     rotation: rotation._value
            // }
            // context.set({})
        }

        const focusElement = () => {
            context.set({ interactions: { focus: element.id } })
        }

        const blurElement = () => {
            context.set({ interactions: { focus: null } })
        }

        const handleMovementDrag: DraggableEventHandler = (_, { deltaX, deltaY }) => {
            pos.emit("update", {
                x: pos.x.value + deltaX,
                y: pos.y.value + deltaY
            })
        }

        const updateTransform = useCallback(() => {
            if (!container.current) {
                return
            }
            container.current.style.transform = `
                translate(${pos.x.value}px, ${pos.y.value}px)
                rotate(${rotation.value}rad)
            `
            container.current.style.width = size.x.value + "px"
            container.current.style.height = size.y.value + "px"
        }, [container, pos, size, rotation])

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

        return (
            <DraggableCore
                {...getHandleProps("move", {
                    onStart: focusElement,
                    onEnd: updateElement
                })}
                onDrag={handleMovementDrag}
                {...draggableProps}
                {...(!config.focusable ? { disabled: true } : {})}
            >
                <div ref={container} style={{
                    transformOrigin: "center, center",
                    cursor: "move"
                }}>
                    <Component
                        element={element}
                        setDraggableProps={setDraggableProps}
                        size={size}
                        rotation={rotation}
                    />
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
