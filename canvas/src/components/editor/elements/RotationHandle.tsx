import RotateIcon from "@mui/icons-material/Replay"
import { DraggableCore, DraggableEventHandler } from "react-draggable"
import { AnimatedValue } from "../../../lib/animation"
import { GetHandleProps } from "./makeElement"

function RotationHandle({ childRect, getHandleProps, onUpdate, animate }: {
    childRect: { width: number, height: number },
    getHandleProps: GetHandleProps,
    onUpdate: () => void,
    animate: AnimatedValue
}) {
    const getRotationAngle = (pos: { x: number, y: number }) => {
        const childCenter = { x: childRect.width / 2, y: childRect.height / 2 }
        pos.x += childCenter.x
        pos.y -= 12
        return Math.atan2(childCenter.y - pos.y, childCenter.x - pos.x) - Math.PI / 2
    }

    const handleRotationDrag: DraggableEventHandler = (_, pos) => {
        animate.emit("update", getRotationAngle(pos))
    }

    return (
        <DraggableCore
            controlled
            onDrag={handleRotationDrag}
            {...getHandleProps("rotate", { onEnd: onUpdate })}
        >
            <div style={{ position: "relative" }}>
                <RotateIcon/>
            </div>
        </DraggableCore>
    )
}

export default RotationHandle
