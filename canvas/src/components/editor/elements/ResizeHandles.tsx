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
    const handleDrag: DraggableEventHandler = (_, { x, y }) => {
        if (aspectRatio) {
            const newX = childRect.width + x
            const newY = newX * aspectRatio
            animate.emit("update", {
                x: newX - childRect.width,
                y: newY - childRect.height
            })
        } else {
            animate.emit("update", { x, y })
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
                right: -14,
                bottom: -14
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
