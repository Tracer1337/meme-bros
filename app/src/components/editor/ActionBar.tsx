import React, { useEffect, useState } from "react"
import { StyleSheet, View } from "react-native"
import { Appbar, IconButton, FAB } from "react-native-paper"
import {
    Editor,
    copyElement,
    layerElement,
    useSharedContext,
    clearCanvas
} from "@meme-bros/client-lib"
import { setListeners } from "../../lib/events"
import { createCanvasElement } from "./utils/canvas"

enum ActionBarMode {
    CANVAS,
    ELEMENT
}

function CanvasActions() {
    const context = useSharedContext()

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

    const id = context.interactions.focus || 0

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

function ActionBar() {    
    const context = useSharedContext()

    const [isGenerating, setIsGenerating] = useState(false)
    const [mode, setMode] = useState<ActionBarMode>(ActionBarMode.CANVAS)

    useEffect(() => {
        if (context.interactions.focus === null) {
            setMode(ActionBarMode.CANVAS)
        } else {
            setMode(ActionBarMode.ELEMENT)
        }
    }, [context.interactions.focus])

    useEffect(() =>
        setListeners(context.events, [
            ["canvas.render.done", () => setIsGenerating(false)]
        ])
    )

    return (
        <Appbar style={styles.appbar}>
            {mode === ActionBarMode.CANVAS
                ? <CanvasActions/>
                : mode === ActionBarMode.ELEMENT
                ? <ElementActions/>
                : null
            }
            <FAB
                style={styles.fab}
                icon="check"
                onPress={async () => {
                    setIsGenerating(true)
                    await new Promise(requestAnimationFrame)
                    context.events.emit("canvas.render")
                }}
                loading={isGenerating}
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
