import React, { useRef } from "react"
import { View, StyleSheet } from "react-native"
import { useNavigate } from "react-router-native"
import { IconButton, Surface, useTheme } from "react-native-paper"
import BottomSheet from "@gorhom/bottom-sheet"
import {
    clearCanvas,
    enableDrawing,
    useModule,
    useSharedContext
} from "@meme-bros/client-lib"
import Switch from "../../inputs/Switch"
import { useCallbacks } from "./utils/callbacks"
import { useCanvasActions } from "../utils/actions"

function CanvasActions() {
    const context = useSharedContext()

    const theme = useTheme()
    
    const core = useModule("core")

    const navigate = useNavigate()
        
    const bottomSheetRef = useRef<BottomSheet>(null)

    const callback = useCallbacks(bottomSheetRef)

    const {
        createElement,
        setBase,
        render,
        isRendering
    } = useCanvasActions()

    return (
        <BottomSheet
            ref={bottomSheetRef}
            snapPoints={[80, 240]}
            index={0}
            backgroundComponent={Surface}
            handleIndicatorStyle={{
                backgroundColor: theme.colors.onSurface
            }}
        >
            <View style={styles.actions}>
                <IconButton
                    color={theme.colors.accent}
                    icon="check"
                    onPress={callback(render)}
                    disabled={!core?.render}
                />
                <IconButton
                    color={theme.colors.onSurface}
                    icon="undo"
                    onPress={callback(() => context.events.emit("history.pop"))}
                />
                <IconButton
                    color={theme.colors.onSurface}
                    icon="format-color-text"
                    onPress={callback(() => createElement("textbox"))}
                />
                <IconButton
                    color={theme.colors.onSurface}
                    icon="image"
                    onPress={callback(() => createElement("image"))}
                />
                <IconButton
                    color={theme.colors.onSurface}
                    icon="shape"
                    onPress={callback(() => createElement("shape"))}
                />
                <IconButton
                    color={theme.colors.onSurface}
                    icon="lead-pencil"
                    onPress={callback(() => context.set(enableDrawing()))}
                />
                <IconButton
                    color={theme.colors.onSurface}
                    icon="sticker"
                    onPress={callback(() => context.events.emit("stickers.open"))}
                />
                <IconButton
                    color={theme.colors.onSurface}
                    icon="delete"
                    onPress={callback(() => {
                        navigate("/")
                        context.set(clearCanvas())
                    })}
                />
            </View>
            {context.canvas.base && (
                <>
                    <Switch
                        style={styles.input}
                        label="Rounded Corners"
                        value={context.canvas.base.rounded}
                        onChange={(rounded) => setBase({ rounded })}
                    />
                    <Switch
                        style={styles.input}
                        label="Spacing"
                        value={context.canvas.base.padding}
                        onChange={(padding) => setBase({ padding })}
                    />
                </>
            )}
        </BottomSheet>
    )
}

const styles = StyleSheet.create({
    actions: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 8
    },

    input: {
        margin: 8,
        marginTop: 0
    }
})

export default CanvasActions
