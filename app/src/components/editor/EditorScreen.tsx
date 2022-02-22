import React, { useEffect } from "react"
import { View } from "react-native"
import { useLocation, useNavigate } from "react-router-native"
import { useModule, useSharedContext } from "@meme-bros/client-lib"
import Screen from "../styled/Screen"
import Canvas from "./Canvas"
import ActionBar from "./ActionBar"

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
            display: "none"
        } : {}}>
            <View style={{ flexGrow: 1 }}>
                <Canvas/>
            </View>
            <ActionBar/>
        </Screen>
    )
}

export default EditorScreen
