import React, { useEffect, useState } from "react"
import { StyleSheet, View } from "react-native"
import { useNavigate } from "react-router-native"
import { IconButton, Surface, useTheme } from "react-native-paper"
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet"
import { Editor } from "@meme-bros/shared"
import {
    copyElement,
    layerElement,
    useSharedContext,
    clearCanvas,
    useListeners,
    useModule,
    enableDrawing
} from "@meme-bros/client-lib"
import { useCanvasUtils } from "./utils/canvas"

enum ActionBarMode {
    CANVAS,
    ELEMENT,
    DRAWING
}

const actionBars: Record<ActionBarMode, React.FunctionComponent> = {
    [ActionBarMode.CANVAS]: CanvasActions,
    [ActionBarMode.ELEMENT]: ElementActions,
    [ActionBarMode.DRAWING]: DrawingActions
}

function CanvasActions() {
    const context = useSharedContext()

    const theme = useTheme()

    const navigate = useNavigate()
    
    const { createCanvasElement } = useCanvasUtils()

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

    return (
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
    )
}

function ElementActions() {
    const context = useSharedContext()

    const theme = useTheme()

    const id = context.focus || 0

    return (   
        <View style={styles.actions}>
            <IconButton
                color={theme.colors.onSurface}
                icon="content-copy"
                onPress={() => context.set(copyElement(context, id))}
            />
            <IconButton
                color={theme.colors.onSurface}
                icon="flip-to-back"
                onPress={() => context.set(layerElement(context, id, -1))}
            />
            <IconButton
                color={theme.colors.onSurface}
                icon="flip-to-front"
                onPress={() => context.set(layerElement(context, id, 1))}
            />
        </View>
    )
}

function DrawingActions() {
    const context = useSharedContext()

    const theme = useTheme()

    return (
        <View style={styles.actions}>
            <IconButton
                color={theme.colors.onSurface}
                icon="arrow-left"
                onPress={() => context.set({
                    drawing: { isDrawing: false }
                })}
            />
            <IconButton
                color={theme.colors.onSurface}
                icon="cog"
                onPress={() => context.events.emit("drawing.config")}
            />
        </View>
    )
}

function ActionBar() {    
    const context = useSharedContext()

    const theme = useTheme()

    const core = useModule("core")

    const [isGenerating, setIsGenerating] = useState(false)
    const [mode, setMode] = useState<ActionBarMode>(ActionBarMode.CANVAS)

    useEffect(() => {
        if (context.drawing.isDrawing) {
            setMode(ActionBarMode.DRAWING)
        } else if (context.focus === null) {
            setMode(ActionBarMode.CANVAS)
        } else {
            setMode(ActionBarMode.ELEMENT)
        }
    }, [context])

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
                {React.createElement(actionBars[mode])}
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

export default ActionBar
