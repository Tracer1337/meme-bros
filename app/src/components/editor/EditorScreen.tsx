import React, { useEffect } from "react"
import { View } from "react-native"
import { useLocation, useNavigate } from "react-router-native"
import { useModule, useSharedContext } from "@meme-bros/client-lib"
import Screen from "../styled/Screen"
import Canvas from "./Canvas"
import ActionBar from "./ActionBar"
import { ACTION_BAR_HEIGHT } from "./constants"

function EditorScreen() {
    const context = useSharedContext()
    
    const navigate = useNavigate()

    const location = useLocation()
    
    const { height } = useModule("view").useDimensions()

    useEffect(() => {
        if (!context.renderCanvas) {
            navigate("/")
        }
    }, [context])

    const isFocused = location.pathname === "/editor"

    return (
        <Screen style={!isFocused ? {
            width: 0,
            height: 0
        } : {}}>
            <View style={!isFocused ? {
                width: 0,
                height: 0
            } : {
                width: "100%",
                height: height - ACTION_BAR_HEIGHT
            }}>
                <Canvas/>
            </View>
            <ActionBar/>
        </Screen>
    )
}

export default EditorScreen
