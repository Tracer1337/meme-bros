import React, { useContext, useState } from "react"
import { DeepPartial } from "tsdef"
import deepmerge from "deepmerge"
import { EditorContext } from "../Context"
import { CanvasElement, PickElement } from "../../../types"
import Interactions from "./Interactions"
import { DraggableCore } from "react-draggable"

type DraggableProps = React.ComponentProps<typeof DraggableCore>

export type ElementProps<T extends CanvasElement["type"]> = {
    element: PickElement<T>,
    setDraggableProps: (props: DraggableProps) => void
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
            updateElement()
        }

        return (
            <DraggableCore
                x={element.rect.x}
                y={element.rect.y}
                {...getHandleProps("move", {
                    onStart: focusElement,
                    onEnd: blurElement
                })}
                {...draggableProps}
                {...(!config.focusable ? { disabled: true } : {})}
            >
                <div style={{}}>
                    <Component
                        element={element}
                        setDraggableProps={setDraggableProps}
                    />
                    {config.focusable && (
                        <Interactions
                            active={context.interactions.focus === element.id}
                            element={element}
                            config={config}
                            onUpdate={updateElement}
                            getHandleProps={getHandleProps}
                        />
                    )}
                </div>
            </DraggableCore>
        )
    }
}

export default makeElement
