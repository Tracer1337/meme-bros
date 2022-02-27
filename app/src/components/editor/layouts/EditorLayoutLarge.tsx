import React from "react"
import { StyleSheet, View } from "react-native"
import { IconButton, Surface } from "react-native-paper"
import Canvas from "../Canvas"

function EditorLayoutLarge() {
    return (
        <View style={styles.container}>
            <Surface style={styles.sidebarRight}>
            </Surface>
            <View style={{ flex: 1 }}>
                <Canvas/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row"
    },

    sidebarRight: {
        width: 60
    },

    icon: {
        marginLeft: 12
    }
})

export default EditorLayoutLarge
