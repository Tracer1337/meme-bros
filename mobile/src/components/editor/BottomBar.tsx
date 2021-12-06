import React, { useContext, useEffect, useState } from "react"
import { StyleSheet, View } from "react-native"
import { Appbar, IconButton, FAB } from "react-native-paper"
import { setListeners } from "../../lib/events"
import { EditorContext } from "./Context"

function BottomBar() {    
    const context = useContext(EditorContext)

    const [isGenerating, setIsGenerating] = useState(false)

    useEffect(() =>
        setListeners(context.events, [
            ["canvas.generate.done", () => setIsGenerating(false)]
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
                    context.events.emit("canvas.generate", context.canvas)
                }}
                loading={isGenerating}
            />
            <View style={styles.right}>
                <IconButton
                    icon="format-color-text"
                    onPress={() => context.events.emit("element.create", "textbox")}
                />
                <IconButton
                    icon="image"
                    onPress={() => context.events.emit("element.create", "image")}
                />
                <IconButton
                    icon="shape"
                    onPress={() => context.events.emit("element.create", "shape")}
                />
            </View>
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
        left: "50%",
        transform: [{ translateX: -24 }, { translateY: -24 }]
    },

    right: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-end"
    }
})

export default BottomBar
