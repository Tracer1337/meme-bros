import { DraggableCore, DraggableEventHandler } from "react-draggable"
import ArrowIcon from "@mui/icons-material/ArrowRightAlt"
import type { GetHandleProps } from "./makeElement"
import { AnimatedValueXY } from "../../../lib/animation"

function ResizeHandles({
    getHandleProps,
    onUpdate,
    childRect,
    aspectRatio,
    animate
}: {
    getHandleProps: GetHandleProps,
    onUpdate: () => void,
    childRect: { width: number, height: number },
    aspectRatio?: number,
    animate: AnimatedValueXY
}) {
    const handleDrag: DraggableEventHandler = (_, { deltaX, deltaY }) => {
        const newSize = {
            x: animate.x.value + deltaX,
            y: animate.y.value + deltaY
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
                right: -28,
                bottom: -28,
                pointerEvents: "all",
                cursor: "se-resize"
            }}>
                <DraggableCore
                    controlled
                    onDrag={handleDrag}
                    {...getHandleProps("resize", { onStop: onUpdate })}
                >
                    <ArrowIcon/>
                </DraggableCore>
            </div>
        </div>
    )
}

export default ResizeHandles
