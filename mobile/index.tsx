import React from "react"
import { AppRegistry } from "react-native"
import { DarkTheme, Provider as PaperProvider } from "react-native-paper"
import App from "./src/App"
import { name as appName } from "./app.json"
import { WebViewProvider } from "./src/lib/WebViewCalls"

function Main() {
    return (
        <PaperProvider theme={DarkTheme}>
            <WebViewProvider>
                <App/>
            </WebViewProvider>
        </PaperProvider>
    )
}

AppRegistry.registerComponent(appName, () => Main)
