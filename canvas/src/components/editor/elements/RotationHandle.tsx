import RotateIcon from "@mui/icons-material/Replay"
import { useEffect, useRef } from "react"
import { DraggableCore, DraggableData, DraggableEventHandler } from "react-draggable"
import { AnimatedValue, AnimatedValueXY } from "../../../lib/animation"
import { setListeners } from "../../../lib/events"
import { Rect } from "../../../types"
import { GetHandleProps } from "./makeElement"

function RotationHandle({ childRect, getHandleProps, onUpdate, animate }: {
    childRect: Rect,
    getHandleProps: GetHandleProps,
    onUpdate: () => void,
    animate: AnimatedValue
}) {
    const handlePos = useRef(new AnimatedValueXY()).current

    const getNextHandlePos = (data: DraggableData) => {
        return {
            x: handlePos.x.value + data.deltaX,
            y: handlePos.y.value + data.deltaY
        }
    }

    const handleRotationStart: DraggableEventHandler = () => {}

    const handleRotationEnd: DraggableEventHandler = () => {
        onUpdate()
    }

    const handleRotationDrag: DraggableEventHandler = (_, data) => {
        handlePos.emit("update", getNextHandlePos(data))
    }

    const handlePositionUpdate = (value: { x: number, y: number }) => {
        const childCenter = {
            x: childRect.x + childRect.x / 2,
            y: childRect.y + childRect.y / 2
        }
        value.x += childCenter.x
        value.y += childCenter.y
        const newRotation = Math.atan2(childCenter.y - value.y, childCenter.x - value.x) - Math.PI / 2
        animate.emit("update", newRotation)
    }

    useEffect(() => setListeners(handlePos, [
        ["update", handlePositionUpdate]
    ]))

    return (
        <DraggableCore
            onDrag={handleRotationDrag}
            {...getHandleProps("rotate", {
                onStart: handleRotationStart,
                onStop: handleRotationEnd
            })}
        >
            <div style={{
                position: "relative",
                pointerEvents: "all",
                cursor: "pointer"
            }}>
                <RotateIcon/>
            </div>
        </DraggableCore>
    )
}

export default RotationHandle
