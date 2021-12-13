import { DraggableCore } from "react-draggable"
import ArrowIcon from "@mui/icons-material/ArrowRightAlt"
import type { GetHandleProps } from "./makeElement"

function ResizeHandles({
    getHandleProps,
    onUpdate,
    // childRect,
    // aspectRatio
}: {
    getHandleProps: GetHandleProps,
    onUpdate: () => void,
    childRect: { width: number, height: number },
    aspectRatio?: number
}) {
    // const handleDrag = (_e: any, { x, y }: { x: number, y: number }) => {
    //     if (aspectRatio) {
    //         const newX = childRect.width + x
    //         const newY = newX * aspectRatio
    //         animate.setValue({
    //             x: newX - childRect.width,
    //             y: newY - childRect.height
    //         })
    //     } else {
    //         animate.setValue({ x, y })
    //     }
    // }

    return (
        <div style={{
            width: "100%",
            height: "100%",
            position: "relative"
        }}>
            <div style={{
                position: "absolute",
                right: 14,
                bottom: 14
            }}>
                <DraggableCore
                    controlled
                    {...getHandleProps("resize", { onEnd: onUpdate })}
                >
                    <ArrowIcon/>
                </DraggableCore>
            </div>
        </div>
    )
}

export default ResizeHandles
