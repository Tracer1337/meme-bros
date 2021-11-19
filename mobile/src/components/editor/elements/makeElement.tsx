import React, { useContext, useState } from "react"
import Draggable, { IDraggableProps } from "react-native-draggable"
import { Element, PickElement } from "./index"
import { EditorContext } from "../Context"

export type ElementProps = {
    setDraggableProps: (props: IDraggableProps) => void
}

function makeElement<T extends Element["type"]>(
    Component: React.ComponentType<ElementProps & {
        element: PickElement<T>
    }>
) {
    return ({ element }: ElementProps & { element: PickElement<T> }) => {
        const context = useContext(EditorContext)
        const [draggableProps, setDraggableProps] = useState<IDraggableProps>({})

        return (
            <Draggable
                x={element.rect.x}
                y={element.rect.y}
                minX={0}
                minY={0}
                maxX={context.dimensions.width}
                maxY={context.dimensions.height}
                touchableOpacityProps={{ activeOpacity: 1 }}
                {...draggableProps}
            >
                <Component
                    element={element}
                    setDraggableProps={setDraggableProps}
                />
            </Draggable>
        )
    }
}

export default makeElement
