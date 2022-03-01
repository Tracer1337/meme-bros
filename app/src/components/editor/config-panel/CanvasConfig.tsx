import React from "react"
import { StyleSheet } from "react-native"
import { Editor } from "@meme-bros/shared"
import { updateCanvasBase, useSharedContext } from "@meme-bros/client-lib"
import Switch from "../../inputs/Switch"

function CanvasConfig() {
    const context = useSharedContext()

    const setBase = (base: Partial<Editor.CanvasBase>) => {
        if (!context.canvas.base) return
        context.events.emit("history.push")
        context.set(updateCanvasBase(context, {
            ...context.canvas.base,
            ...base
        }))
    }

    return (
        <>
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
        </>
    )
}

const styles = StyleSheet.create({
    input: {
        margin: 8,
        marginTop: 0
    }
})

export default CanvasConfig
