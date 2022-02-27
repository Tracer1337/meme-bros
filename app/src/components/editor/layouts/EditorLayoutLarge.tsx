import React from "react"
import { View } from "react-native"
import Canvas from "../Canvas"
import { ACTION_BAR_HEIGHT } from "../constants"

function EditorLayoutLarge() {
    return (
        <>
            <View style={{
                flexGrow: 1,
                paddingBottom: ACTION_BAR_HEIGHT
            }}>
                <Canvas/>
            </View>
        </>
    )
}

export default EditorLayoutLarge
