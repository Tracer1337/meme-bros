import React from "react"
import { View } from "react-native"
import ActionBar from "../actions/ActionBar"
import Canvas from "../Canvas"
import { ACTION_BAR_HEIGHT } from "../constants"

function EditorLayoutSmall() {
    return (
        <>
            <View style={{
                flexGrow: 1,
                paddingBottom: ACTION_BAR_HEIGHT
            }}>
                <Canvas/>
            </View>
            <ActionBar/>
        </>
    )
}

export default EditorLayoutSmall
