import React, { useContext } from "react"
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import type { ElementConfig, GetHandleProps } from "./makeElement"
import ResizeHandles from "./ResizeHandles"
import RotationHandle from "./RotationHandle"
import globalStyles from "../../../styles"
import { EditorContext, ElementEvents } from "../Context"
import { CanvasElement } from "../../../types"

function ActionHandle({ icon, onPress }: {
    icon: string,
    onPress: () => void
}) {
    return (
        <TouchableOpacity onPress={onPress}>
            <Icon
                name={icon}
                size={24}
                color="#000"
                style={globalStyles.handle}
            />
        </TouchableOpacity>
    )
}

function Interactions({
    element,
    config,
    size,
    rotation,
    onUpdate,
    getHandleProps
}: {
    element: CanvasElement,
    config: ElementConfig,
    size: Animated.ValueXY,
    rotation: Animated.Value,
    onUpdate: () => void,
    getHandleProps: GetHandleProps
}) {
    const context = useContext(EditorContext)

    const event = (name: ElementEvents) => () => {
        context.events.emit(`element.${name}`, element.id)
    }

    return (
        <View style={styles.controls}>
            <View style={styles.topControls}>
                {config.interactions.rotate && (
                    <View style={{ marginRight: 8 }}>
                        <RotationHandle
                            animate={rotation}
                            childRect={element.rect}
                            onUpdate={onUpdate}
                            getHandleProps={getHandleProps}
                        />
                    </View>
                )}
                {config.interactions.edit && (
                    <View style={{ marginRight: 8 }}>
                        <ActionHandle icon="pencil" onPress={event("edit")}/>
                    </View>
                )}
                {config.interactions.config && (
                    <View style={{ marginRight: 8 }}>
                        <ActionHandle icon="cog" onPress={event("config")}/>
                    </View>
                )}
                {config.interactions.delete && (
                    <View>
                        <ActionHandle icon="delete-outline" onPress={event("remove")}/>
                    </View>
                )}
            </View>
            {config.interactions.resize && (
                <ResizeHandles
                    animate={size}
                    getHandleProps={getHandleProps}
                    onUpdate={onUpdate}
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    controls: {
        width: "100%",
        height: "100%",
        position: "absolute"
    },

    topControls: {
        position: "absolute",
        top: -24,
        width: "100%",
        flex: 1,
        flexDirection: "row",
        justifyContent: "center"
    }
})

export default Interactions
