import { DraggableCore, DraggableEventHandler } from "react-draggable"
import ArrowIcon from "@mui/icons-material/Height"
import Handle from "./Handle"
import { useAnimationRegistry } from "../lib/animation"

type MakeDragHandler = (matrix: [number, number]) => DraggableEventHandler

function ResizeHandles({ onUpdate }: {
    onUpdate: () => void
}) {
    const animations = useAnimationRegistry()

    const makeDragHandler: MakeDragHandler = (matrix) =>
        (_, { deltaX, deltaY }) => {
            const animate = animations.getAnimationXY("canvas.size")
            const newSize = {
                x: animate.x.value + deltaX * matrix[0] * 2,
                y: animate.y.value + deltaY * matrix[1] * 2
            }
            animate.emit("update", newSize)
        }

    return (
        <div style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            pointerEvents: "none"
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
                <DraggableCore onDrag={makeDragHandler([0, 1])} onStop={onUpdate}>
                    <ArrowIcon sx={{ color: "common.black" }} />
                </DraggableCore>
            </Handle>
            <Handle
                sx={{
                    position: "absolute",
                    top: "50%",
                    right: -14,
                    transform: "translateY(-14px) rotate(90deg)",
                    cursor: "e-resize"
                }}
            >
                <DraggableCore onDrag={makeDragHandler([1, 0])} onStop={onUpdate}>
                    <ArrowIcon sx={{ color: "common.black" }} />
                </DraggableCore>
            </Handle>
        </div>
    )
}

export default ResizeHandles
