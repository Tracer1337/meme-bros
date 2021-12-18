import { DraggableCore, DraggableEventHandler } from "react-draggable"
import ArrowIcon from "@mui/icons-material/Height"
import type { GetHandleProps } from "./makeElement"
import { AnimatedValueXY } from "../../lib/animation"
import Handle from "./Handle"

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
            <Handle
                sx={{
                    position: "absolute",
                    left: "50%",
                    bottom: -14,
                    transform: "translateX(-14px)",
                    cursor: "n-resize"
                }}
            >
                <DraggableCore
                    onDrag={makeDragHandler([0, 1])}
                    {...getHandleProps("resize", { onStop: onUpdate })}
                >
                    <ArrowIcon sx={{ color: "common.black" }} />
                </DraggableCore>
            </Handle>

            <Handle
                sx={{
                    position: "absolute",
                    top: "50%",
                    right: -14,
                    transform: "translateY(-14px) rotate(90deg)",
                    pointerEvents: "all",
                    cursor: "e-resize"
                }}
            >
                <DraggableCore
                    onDrag={makeDragHandler([1, 0])}
                    {...getHandleProps("resize", { onStop: onUpdate })}
                >
                    <ArrowIcon sx={{ color: "common.black" }} />
                </DraggableCore>
            </Handle>

            <Handle
                sx={{
                    position: "absolute",
                    right: -14,
                    bottom: -14,
                    transform: "rotate(-45deg)",
                    pointerEvents: "all",
                    cursor: "se-resize"
                }}
            >
                <DraggableCore
                    onDrag={makeDragHandler([1, 1])}
                    {...getHandleProps("resize", { onStop: onUpdate })}
                >
                    <ArrowIcon sx={{ color: "common.black" }} />
                </DraggableCore>
            </Handle>
        </div>
    )
}

export default ResizeHandles
