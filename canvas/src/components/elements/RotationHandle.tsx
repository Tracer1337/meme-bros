import { useRef } from "react"
import { DraggableCore, DraggableData, DraggableEventHandler } from "react-draggable"
import RotateIcon from "@mui/icons-material/Replay"
import { Editor } from "@meme-bros/shared"
import { useSharedContext } from "@meme-bros/shared"
import { AnimatedValue } from "../../lib/animation"
import Handle from "./Handle"
import { GetHandleProps } from "./makeElement"

function RotationHandle({ childRect, getHandleProps, onUpdate, animate }: {
    childRect: Editor.Rect,
    getHandleProps: GetHandleProps,
    onUpdate: () => void,
    animate: AnimatedValue
}) {
    const context = useSharedContext()

    const handleRef = useRef<HTMLDivElement>(null)
    const lastRotation = useRef(childRect.rotation)

    const getChildCenter = () => ({
        x: childRect.x + childRect.width / 2,
        y: childRect.y + childRect.height / 2
    })

    const getRotationAngle = (data: DraggableData) => {
        if (!context.canvasDomRect) {
            return 0
        }
        const childCenter = getChildCenter()
        data.x -= context.canvasDomRect.x
        data.y -= context.canvasDomRect.y
        const childToMouse = Math.atan2(childCenter.y - data.y, childCenter.x - data.x)
        return childToMouse - Math.PI / 2 - lastRotation.current
    }

    const handleRotationStart: DraggableEventHandler = (_, data) => {
        lastRotation.current = getRotationAngle(data)
    }

    const handleRotationEnd: DraggableEventHandler = (_, data) => {
        lastRotation.current = getRotationAngle(data)
        onUpdate()
    }

    const handleRotationDrag: DraggableEventHandler = (_, data) => {
        animate.emit("update", getRotationAngle(data))
    }

    return (
        <Handle sx={{ mr: 1 }} ref={handleRef}>
            <DraggableCore
                onDrag={handleRotationDrag}
                {...getHandleProps("rotate", {
                    onStart: handleRotationStart,
                    onStop: handleRotationEnd
                })}
            >
                <RotateIcon sx={{ color: "common.black" }}/>
            </DraggableCore>
        </Handle>
    )
}

export default RotationHandle
