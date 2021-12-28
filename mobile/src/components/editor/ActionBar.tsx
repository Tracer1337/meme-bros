import React, { useEffect, useState } from "react"
import { copyElement, layerElement, useSharedContext } from "@meme-bros/shared"
import { StyleSheet, View } from "react-native"
import { Appbar, IconButton, FAB } from "react-native-paper"
import { setListeners } from "../../lib/events"

enum ActionBarMode {
    CANVAS,
    ELEMENT
}

function CanvasActions() {
    const context = useSharedContext()

    return (   
        <View style={styles.actions}>
            <IconButton
                icon="format-color-text"
                onPress={() => context.events.emit("element.create", { type: "textbox" })}
            />
            <IconButton
                icon="image"
                onPress={() => context.events.emit("element.create", { type: "image" })}
            />
            <IconButton
                icon="shape"
                onPress={() => context.events.emit("element.create", { type: "shape" })}
            />
            <IconButton
                icon="delete"
                onPress={() => context.set({
                    renderCanvas: false,
                    canvas: { elements: [] }
                })}
            />
            <IconButton
                icon="undo"
                onPress={() => context.events.emit("history.pop", null)}
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
            <FAB
                style={styles.fab}
                icon="check"
                onPress={async () => {
                    setIsGenerating(true)
                    await new Promise(requestAnimationFrame)
                    context.events.emit("canvas.render", null)
                }}
                loading={isGenerating}
            />
            {mode === ActionBarMode.CANVAS
                ? <CanvasActions/>
                : mode === ActionBarMode.ELEMENT
                ? <ElementActions/>
                : null
            }
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
