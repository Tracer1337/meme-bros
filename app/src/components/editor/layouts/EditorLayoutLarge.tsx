import React from "react"
import { StyleSheet, View } from "react-native"
import Canvas from "../Canvas"
import ConfigBar from "../config-bar/ConfigBar"
import ItemBar from "../item-bar/ItemBar"

function EditorLayoutLarge() {
    return (
        <View style={styles.container}>
            <ItemBar/>
            <View style={{ flex: 1 }}>
                <Canvas/>
            </View>
            <ConfigBar/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row"
    }
})

export default EditorLayoutLarge
