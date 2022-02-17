import React, { useEffect, useState } from "react"
import { StyleSheet, View } from "react-native"
import { Appbar, IconButton, FAB } from "react-native-paper"
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
                    icon="cog"
                    onPress={() => context.events.emit("canvas.base.config")}
                />
            )}
            <IconButton
                icon="format-color-text"
                onPress={() => handleElementCreate("textbox")}
            />
            <IconButton
                icon="image"
                onPress={() => handleElementCreate("image")}
            />
            <IconButton
                icon="shape"
                onPress={() => handleElementCreate("shape")}
            />
            <IconButton
                icon="lead-pencil"
                onPress={() => context.set(enableDrawing())}
            />
            <IconButton
                icon="delete"
                onPress={() => context.set(clearCanvas())}
            />
            <IconButton
                icon="undo"
                onPress={() => context.events.emit("history.pop")}
            />
        </View>
    )
}

function ElementActions() {
    const context = useSharedContext()

    const id = context.focus || 0

    return (   
        <View style={styles.actions}>
            <IconButton
                icon="content-copy"
                onPress={() => context.set(copyElement(context, id))}
            />
            <IconButton
                icon="flip-to-back"
                onPress={() => context.set(layerElement(context, id, -1))}
            />
            <IconButton
                icon="flip-to-front"
                onPress={() => context.set(layerElement(context, id, 1))}
            />
        </View>
    )
}

function DrawingActions() {
    const context = useSharedContext()

    return (
        <View style={styles.actions}>
            <IconButton
                icon="arrow-left"
                onPress={() => context.set({
                    drawing: { isDrawing: false }
                })}
            />
        </View>
    )
}

function ActionBar() {    
    const context = useSharedContext()

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
        <Appbar style={styles.appbar}>
            {React.createElement(actionBars[mode])}
            <FAB
                style={styles.fab}
                icon="check"
                loading={isGenerating}
                disabled={!core?.render}
                onPress={async () => {
                    setIsGenerating(true)
                    await new Promise(requestAnimationFrame)
                    context.events.emit("canvas.render")
                }}
            />
        </Appbar>
    )
}

const styles = StyleSheet.create({
    appbar: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        flex: 1
    },
    
    fab: {
        position: "absolute",
        right: 24,
        top: -24
    },

    actions: {
        flex: 1,
        flexDirection: "row"
    }
})

export default ActionBar
