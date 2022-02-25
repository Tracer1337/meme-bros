import React, { useEffect } from "react"
import { View } from "react-native"
import { useLocation, useNavigate } from "react-router-native"
import { useSharedContext } from "@meme-bros/client-lib"
import Screen from "../styled/Screen"
import Canvas from "./Canvas"
import ActionBar from "./ActionBar"
import { ACTION_BAR_HEIGHT } from "./constants"

function EditorScreen() {
    const context = useSharedContext()
    
    const navigate = useNavigate()

    const location = useLocation()

    useEffect(() => {
        if (!context.renderCanvas) {
            navigate("/")
        }
    }, [context])

    const isFocused = location.pathname === "/editor"

    return (
        <Screen style={!isFocused ? {
            display: "none"
        } : {}}>
            <View style={{
                flexGrow: 1,
                paddingBottom: ACTION_BAR_HEIGHT
            }}>
                <Canvas/>
            </View>
            <ActionBar/>
        </Screen>
    )
}

export default EditorScreen
