import React, { useState } from "react"
import { StyleSheet } from "react-native"
import { useNavigate } from "react-router-native"
import { Divider, IconButton, Surface, useTheme } from "react-native-paper"
import { Editor } from "@meme-bros/shared"
import {
    clearCanvas,
    enableDrawing,
    useListeners,
    useModule,
    useSharedContext
} from "@meme-bros/client-lib"
import { useCanvasUtils } from "../utils/canvas"

function ItemPanel() {
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

    const handleGenerate = async () => {
        setIsGenerating(true)
        await new Promise(requestAnimationFrame)
        context.events.emit("canvas.render")
    }

    useListeners(context.events, [
        ["canvas.render.done", () => setIsGenerating(false)]
    ])
  
    return (
        <Surface style={styles.container}>
            <IconButton
                style={styles.icon}
                color={theme.colors.onSurface}
                icon="format-color-text"
                onPress={() => handleElementCreate("textbox")}
            />
            <IconButton
                style={styles.icon}
                color={theme.colors.onSurface}
                icon="image"
                onPress={() => handleElementCreate("image")}
            />
            <IconButton
                style={styles.icon}
                color={theme.colors.onSurface}
                icon="shape"
                onPress={() => handleElementCreate("shape")}
            />
            <IconButton
                style={styles.icon}
                color={theme.colors.onSurface}
                icon="lead-pencil"
                onPress={() => context.set(enableDrawing())}
            />
            <IconButton
                style={styles.icon}
                color={theme.colors.onSurface}
                icon="sticker"
                onPress={() => context.events.emit("stickers.open")}
            />
            <Divider style={styles.divider}/>
            <IconButton
                style={styles.icon}
                color={theme.colors.accent}
                icon="check"
                onPress={handleGenerate}
                isLoading={isGenerating}
                disabled={!core?.render}
            />
            <IconButton
                style={styles.icon}
                color={theme.colors.onSurface}
                icon="undo"
                onPress={() => context.events.emit("history.pop")} 
            />
            <IconButton
                style={styles.icon}
                color={theme.colors.onSurface}
                icon="delete"
                onPress={() => {
                    navigate("/")
                    context.set(clearCanvas())
                }}
            />
        </Surface>
    )
}

const styles = StyleSheet.create({
    container: {
        width: 60
    },

    icon: {
        marginLeft: 12
    },

    divider: {
        marginVertical: 8
    }
})

export default ItemPanel
