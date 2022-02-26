import React, { useState } from "react"
import { View, StyleSheet } from "react-native"
import { useNavigate } from "react-router-native"
import { IconButton, Surface, useTheme } from "react-native-paper"
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet"
import { Editor } from "@meme-bros/shared"
import {
    clearCanvas,
    enableDrawing,
    useListeners,
    useModule,
    useSharedContext
} from "@meme-bros/client-lib"
import { useCanvasUtils } from "./utils/canvas"

function CanvasActions() {
    const context = useSharedContext()

    const theme = useTheme()

    const core = useModule("core")

    const navigate = useNavigate()
    
    const { createCanvasElement } = useCanvasUtils()

    const [isGenerating, setIsGenerating] = useState(false)

    const handleElementCreate = async (type: Editor.CanvasElement["type"]) => {
        if (!type) {
            return
        }
        const partial = await createCanvasElement(type)
        if (!partial) {
            return
        }
        context.events.emit("element.create", partial)
    }

    useListeners(context.events, [
        ["canvas.render.done", () => setIsGenerating(false)]
    ])

    return (
        <BottomSheet
            snapPoints={[80, 300]}
            index={0}
            backgroundComponent={Surface}
            handleIndicatorStyle={{
                backgroundColor: theme.colors.onSurface
            }}
        >
            <BottomSheetView style={styles.container}>
                <View style={styles.actions}>
                    {context.canvas.mode === Editor.CanvasMode.CLASSIC && (
                        <IconButton
                            color={theme.colors.onSurface}
                            icon="cog"
                            onPress={() => context.events.emit("canvas.base.config")}
                        />
                    )}
                    <IconButton
                        color={theme.colors.onSurface}
                        icon="format-color-text"
                        onPress={() => handleElementCreate("textbox")}
                    />
                    <IconButton
                        color={theme.colors.onSurface}
                        icon="image"
                        onPress={() => handleElementCreate("image")}
                    />
                    <IconButton
                        color={theme.colors.onSurface}
                        icon="shape"
                        onPress={() => handleElementCreate("shape")}
                    />
                    <IconButton
                        color={theme.colors.onSurface}
                        icon="lead-pencil"
                        onPress={() => context.set(enableDrawing())}
                    />
                    <IconButton
                        color={theme.colors.onSurface}
                        icon="sticker"
                        onPress={() => context.events.emit("stickers.open")}
                    />
                    <IconButton
                        color={theme.colors.onSurface}
                        icon="delete"
                        onPress={() => {
                            navigate("/")
                            context.set(clearCanvas())
                        }}
                    />
                    <IconButton
                        color={theme.colors.onSurface}
                        icon="undo"
                        onPress={() => context.events.emit("history.pop")}
                    />
                </View>
                <IconButton
                    color={theme.colors.onSurface}
                    icon="check"
                    loading={isGenerating}
                    disabled={!core?.render}
                    onPress={async () => {
                        setIsGenerating(true)
                        await new Promise(requestAnimationFrame)
                        context.events.emit("canvas.render")
                    }}
                />
            </BottomSheetView>
        </BottomSheet>
    )
}
const styles = StyleSheet.create({
    container: {
        flexDirection: "row"
    },

    actions: {
        flex: 1,
        flexDirection: "row"
    }
})

export default CanvasActions
