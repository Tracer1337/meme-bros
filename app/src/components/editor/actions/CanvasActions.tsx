import React, { useRef, useState } from "react"
import { View, StyleSheet } from "react-native"
import { useNavigate } from "react-router-native"
import { Surface, useTheme } from "react-native-paper"
import BottomSheet from "@gorhom/bottom-sheet"
import { Editor } from "@meme-bros/shared"
import {
    clearCanvas,
    enableDrawing,
    updateCanvasBase,
    useListeners,
    useModule,
    useSharedContext
} from "@meme-bros/client-lib"
import { useCanvasUtils } from "../utils/canvas"
import { useActions } from "./utils/actions"
import Switch from "../../inputs/Switch"

function CanvasActions() {
    const context = useSharedContext()

    const theme = useTheme()
    
    const core = useModule("core")

    const navigate = useNavigate()
    
    const { createCanvasElement } = useCanvasUtils()

    const bottomSheetRef = useRef<BottomSheet>(null)

    const { action } = useActions({ bottomSheetRef })
    
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

    const setBase = (base: Partial<Editor.CanvasBase>) => {
        if (!context.canvas.base) return
        context.events.emit("history.push")
        context.set(updateCanvasBase(context, {
            ...context.canvas.base,
            ...base
        }))
    }

    useListeners(context.events, [
        ["canvas.render.done", () => setIsGenerating(false)]
    ])

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
                {action(
                    "check",
                    async () => {
                        bottomSheetRef.current?.collapse()
                        setIsGenerating(true)
                        await new Promise(requestAnimationFrame)
                        context.events.emit("canvas.render")
                    },
                    {
                        loading: isGenerating,
                        disabled: !core?.render,
                        color: theme.colors.accent
                    }
                )}
                {action("undo", () => context.events.emit("history.pop"))}
                {action("format-color-text", () => handleElementCreate("textbox"))}
                {action("image", () => handleElementCreate("image"))}
                {action("shape", () => handleElementCreate("shape"))}
                {action("lead-pencil", () => context.set(enableDrawing()))}
                {action("sticker", () => context.events.emit("stickers.open"))}
                {action("delete", () => {
                    navigate("/")
                    context.set(clearCanvas())
                })}
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
