import React from "react"
import { View } from "react-native"
import { Outlet } from "react-router-native"
import EditorScreen from "../editor/EditorScreen"

function Layout() {
    return (
        <View style={{
            width: "100%",
            height: "100%"
        }}>
            <EditorScreen/>
            <Outlet/>
        </View>
    )
}

export default Layout
