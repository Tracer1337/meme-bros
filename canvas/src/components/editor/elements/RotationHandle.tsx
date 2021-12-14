import RotateIcon from "@mui/icons-material/Replay"
import { DraggableCore } from "react-draggable"
import { GetHandleProps } from "./makeElement"

function RotationHandle({ getHandleProps, onUpdate }: {
    childRect: { width: number, height: number },
    getHandleProps: GetHandleProps,
    onUpdate: () => void
}) {
    // const getRotationAngle = (pos: { x: number, y: number }) => {
    //     const childCenter = { x: childRect.width / 2, y: childRect.height / 2 }
    //     pos.x += childCenter.x
    //     pos.y -= 12
    //     return Math.atan2(childCenter.y - pos.y, childCenter.x - pos.x) - Math.PI / 2
    // }

    const handleRotationDrag = (_e: any, pos: { x: number, y: number }) => {
        // animate.setValue(getRotationAngle(pos))
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
