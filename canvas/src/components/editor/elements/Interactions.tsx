import React, { useContext } from "react"
import EditIcon from "@mui/icons-material/Edit"
import SettingsIcon from "@mui/icons-material/Settings"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import type { ElementConfig, GetHandleProps } from "./makeElement"
import ResizeHandles from "./ResizeHandles"
import RotationHandle from "./RotationHandle"
import { EditorContext, ElementEvents } from "../Context"
import { CanvasElement } from "../../../types"
import { AnimatedValue, AnimatedValueXY } from "../../../lib/animation"

function ActionHandle({ icon, onPress }: {
    icon: React.ComponentType<any>,
    onPress: () => void
}) {
    return (
        <div onClick={onPress}>
            {React.createElement(icon)}
        </div>
    )
}

function Interactions({
    element,
    config,
    onUpdate,
    getHandleProps,
    size,
    rotation
}: {
    element: CanvasElement,
    config: ElementConfig,
    onUpdate: () => void,
    getHandleProps: GetHandleProps,
    size: AnimatedValueXY,
    rotation: AnimatedValue
}) {
    const context = useContext(EditorContext)

    const event = (name: ElementEvents) => () => {
        context.events.emit(`element.${name}`, element.id)
    }

    return (
        <div style={{
            width: "100%",
            height: "100%",
            position: "absolute"
        }}>
            <div style={{
                position: "absolute",
                top: -24,
                width: "100%",
                flex: 1,
                flexDirection: "row",
                justifyContent: "center"
            }}>
                {config.interactions.rotate && (
                    <div style={{ marginRight: 8 }}>
                        <RotationHandle
                            animate={rotation}
                            childRect={element.rect}
                            onUpdate={onUpdate}
                            getHandleProps={getHandleProps}
                        />
                    </div>
                )}
                {config.interactions.edit && (
                    <div style={{ marginRight: 8 }}>
                        <ActionHandle icon={EditIcon} onPress={event("edit")}/>
                    </div>
                )}
                {config.interactions.config && (
                    <div style={{ marginRight: 8 }}>
                        <ActionHandle icon={SettingsIcon} onPress={event("config")}/>
                    </div>
                )}
                {config.interactions.delete && (
                    <div>
                        <ActionHandle icon={DeleteOutlineIcon} onPress={event("remove")}/>
                    </div>
                )}
            </div>
            {config.interactions.resize && (
                <ResizeHandles
                    animate={size}
                    getHandleProps={getHandleProps}
                    onUpdate={onUpdate}
                    childRect={element.rect}
                    aspectRatio={config.aspectRatio}
                />
            )}
        </div>
    )
}

export default Interactions
