import { Editor } from "@meme-bros/shared"
import type { ElementConfig, GetHandleProps } from "./makeElement"
import ResizeHandles from "./ResizeHandles"
import RotationHandle from "./RotationHandle"
import { useAnimationRegistry } from "../../lib/animation"

function Interactions({
    element,
    config,
    onUpdate,
    getHandleProps
}: {
    element: Editor.CanvasElement,
    config: ElementConfig,
    onUpdate: () => void,
    getHandleProps: GetHandleProps
}) {
    const animations = useAnimationRegistry()

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
                        animate={animations.getAnimation(
                            `element.${element.id}.rotation`
                        )}
                        childRect={element.rect}
                        onUpdate={onUpdate}
                        getHandleProps={getHandleProps}
                    />
                )}
            </div>
            {config.interactions.resize && (
                <ResizeHandles
                    animate={animations.getAnimationXY(
                        `element.${element.id}.size`
                    )}
                    getHandleProps={getHandleProps}
                    onUpdate={onUpdate}
                    aspectRatio={config.aspectRatio}
                />
            )}
        </div>
    )
}

export default Interactions
