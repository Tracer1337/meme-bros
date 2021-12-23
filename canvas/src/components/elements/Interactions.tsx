import { useContext } from "react"
import EditIcon from "@mui/icons-material/Edit"
import SettingsIcon from "@mui/icons-material/Settings"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import * as Core from "@meme-bros/core"
import type { ElementConfig, GetHandleProps } from "./makeElement"
import ResizeHandles from "./ResizeHandles"
import RotationHandle from "./RotationHandle"
import { CanvasContext, ElementEvents } from "../Context"
import { AnimatedValue, AnimatedValueXY } from "../../lib/animation"
import Handle from "./Handle"

function Interactions({
    element,
    config,
    onUpdate,
    getHandleProps,
    size,
    rotation
}: {
    element: Core.CanvasElement,
    config: ElementConfig,
    onUpdate: () => void,
    getHandleProps: GetHandleProps,
    size: AnimatedValueXY,
    rotation: AnimatedValue
}) {
    const context = useContext(CanvasContext)

    const event = (name: ElementEvents) => () => {
        context.events.emit(`element.${name}`, element.id)
    }

    return (
        <div style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            pointerEvents: "none"
        }}>
            <div style={{
                position: "absolute",
                top: -24,
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center"
            }}>
                {config.interactions.rotate && (
                    <RotationHandle
                        animate={rotation}
                        childRect={element.rect}
                        onUpdate={onUpdate}
                        getHandleProps={getHandleProps}
                    />
                )}
                {config.interactions.edit && (
                    <Handle onClick={event("edit")} sx={{ mr: 1 }}>
                        <EditIcon sx={{ color: "common.black" }}/>
                    </Handle>
                )}
                {config.interactions.config && (
                    <Handle onClick={event("config")} sx={{ mr: 1 }}>
                        <SettingsIcon sx={{ color: "common.black" }}/>
                    </Handle>
                )}
                {config.interactions.delete && (
                    <Handle onClick={event("remove")}>
                        <DeleteOutlineIcon sx={{ color: "common.black" }}/>
                    </Handle>
                )}
            </div>
            {config.interactions.resize && (
                <ResizeHandles
                    animate={size}
                    getHandleProps={getHandleProps}
                    onUpdate={onUpdate}
                    aspectRatio={config.aspectRatio}
                />
            )}
        </div>
    )
}

export default Interactions
