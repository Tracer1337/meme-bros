import React, { Suspense, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-native"
import { ActivityIndicator } from "react-native-paper"
import { useSharedContext } from "@meme-bros/client-lib"
import Screen from "../styled/Screen"
import { useLayout } from "../../lib/layout"

const EditorLayoutSmall = React.lazy(() => import("./layouts/EditorLayoutSmall"))
const EditorLayoutLarge = React.lazy(() => import("./layouts/EditorLayoutLarge"))

function EditorScreen() {
    const context = useSharedContext()
    
    const navigate = useNavigate()

    const location = useLocation()

    const Layout = useLayout({
        sm: EditorLayoutSmall,
        lg: EditorLayoutLarge
    })

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
            <Suspense fallback={<ActivityIndicator/>}>
                <Layout/>
            </Suspense>
        </Screen>
    )
}

export default EditorScreen
