import React, { useContext } from "react"
import { StyleSheet, View } from "react-native"
import { Appbar, FAB, IconButton } from "react-native-paper"
import { EditorContext } from "./Context"

function BottomBar() {    
    const context = useContext(EditorContext)

    return (
        <Appbar style={styles.appbar}>
            <FAB
                style={styles.fab}
                icon="check"
                onPress={() => context.events.emit("canvas.generate", context.canvas)}
            />
            <View style={styles.right}>
                <IconButton
                    icon="format-color-text"
                    onPress={() => context.events.emit("element.create", "textbox")}
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
