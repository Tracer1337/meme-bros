import { DraggableCore, DraggableEventHandler } from "react-draggable"
import ArrowIcon from "@mui/icons-material/ArrowRightAlt"
import type { GetHandleProps } from "./makeElement"
import { AnimatedValueXY } from "../../../lib/animation"

type MakeDragHandler = (matrix: [number, number]) => DraggableEventHandler

function ResizeHandles({
    getHandleProps,
    onUpdate,
    aspectRatio,
    animate
}: {
    getHandleProps: GetHandleProps,
    onUpdate: () => void,
    aspectRatio?: number,
    animate: AnimatedValueXY
}) {
    const makeDragHandler: MakeDragHandler = (matrix) =>
        (_, { deltaX, deltaY }) => {
            const newSize = {
                x: animate.x.value + deltaX * matrix[0],
                y: animate.y.value + deltaY * matrix[1]
            }
            if (aspectRatio) {
                newSize.y = newSize.x * aspectRatio
                animate.emit("update", newSize)
            } else {
                animate.emit("update", newSize)
            }
        }

    return (
        <div style={{
            width: "100%",
            height: "100%",
            position: "relative"
        }}>
            <div style={{
                position: "absolute",
                left: "50%",
                bottom: -28,
                transform: "translateX(-14px)",
                pointerEvents: "all",
                cursor: "n-resize"
            }}>
                <DraggableCore
                    onDrag={makeDragHandler([0, 1])}
                    {...getHandleProps("resize", { onStop: onUpdate })}
                >
                    <ArrowIcon/>
                </DraggableCore>
            </div>

            <div style={{
                position: "absolute",
                top: "50%",
                right: -28,
                transform: "translateY(-14px)",
                pointerEvents: "all",
                cursor: "e-resize"
            }}>
                <DraggableCore
                    onDrag={makeDragHandler([1, 0])}
                    {...getHandleProps("resize", { onStop: onUpdate })}
                >
                    <ArrowIcon/>
                </DraggableCore>
            </div>

            <div style={{
                position: "absolute",
                right: -28,
                bottom: -28,
                pointerEvents: "all",
                cursor: "se-resize"
            }}>
                <DraggableCore
                    onDrag={makeDragHandler([1, 1])}
                    {...getHandleProps("resize", { onStop: onUpdate })}
                >
                    <ArrowIcon/>
                </DraggableCore>
            </div>
        </div>
    )
}

export default ResizeHandles
