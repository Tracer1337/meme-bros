import React from "react"
import { SafeAreaView } from "react-native"
import { Outlet } from "react-router-native"
import { useTheme } from "react-native-paper"
import EditorScreen from "../editor/EditorScreen"
import Header from "./Header"

function Layout() {
    const theme = useTheme()
    
    return (
        <SafeAreaView style={{
            width: "100%",
            height: "100%",
            backgroundColor: theme.colors.background
        }}>
            <Header/>
            <EditorScreen/>
            <Outlet/>
        </SafeAreaView>
    )
}

export default Layout
