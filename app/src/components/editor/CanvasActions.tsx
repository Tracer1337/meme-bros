import React, { useRef, useState } from "react"
import { View, StyleSheet } from "react-native"
import { useNavigate } from "react-router-native"
import { Surface, useTheme } from "react-native-paper"
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
import { useActions } from "./utils/actions"

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

    useListeners(context.events, [
        ["canvas.render.done", () => setIsGenerating(false)]
    ])

    return (
        <BottomSheet
            ref={bottomSheetRef}
            snapPoints={[80, 130]}
            index={0}
            backgroundComponent={Surface}
            handleIndicatorStyle={{
                backgroundColor: theme.colors.onSurface
            }}
        >
            <BottomSheetView style={styles.container}>
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
                    {context.canvas.mode === Editor.CanvasMode.CLASSIC && (
                        action("cog", () => context.events.emit("canvas.base.config"))
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
        flexDirection: "row",
        flexWrap: "wrap"
    }
})

export default CanvasActions
